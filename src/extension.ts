import * as vscode from 'vscode';

let syncEnabled = true;
let statusBarItem: vscode.StatusBarItem;
let lastCursorPositionByEditor = new Map<vscode.TextEditor, vscode.Position>();
let isEditorFocused = new Map<vscode.TextEditor, boolean>();
let hasMovedOnce = new Map<vscode.TextEditor, boolean>();
let activeEditorForSync: vscode.TextEditor | null = null;

export function activate(context: vscode.ExtensionContext) {
  let lastSync = 0;
  const debounceTime = 100; // ms
  let lastUserEditor: vscode.TextEditor | null = null;

  // Status bar item
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  statusBarItem.command = 'extension.toggleCursorSync';
  context.subscriptions.push(statusBarItem);
  updateStatusBar();
  statusBarItem.show();

  // Register command to toggle sync
  const toggleCommand = vscode.commands.registerCommand('extension.toggleCursorSync', () => {
    syncEnabled = !syncEnabled;
    updateStatusBar();
  });
  context.subscriptions.push(toggleCommand);

  vscode.window.onDidChangeTextEditorSelection(event => {
    if (!syncEnabled) return;

    const sourceEditor = event.textEditor;
    const activePos = sourceEditor.selection.active;
    const prevPos = lastCursorPositionByEditor.get(sourceEditor);

    // Do not sync if it's the initial cursor placement or if there's no actual change
    if (!hasMovedOnce.get(sourceEditor)) {
      hasMovedOnce.set(sourceEditor, true);
      return; // Waiting for the first real cursor movement
    }

    // Sync only if the cursor position has actually changed
    if (!prevPos || !activePos.isEqual(prevPos)) {
      lastUserEditor = sourceEditor;
      lastCursorPositionByEditor.set(sourceEditor, activePos);
    } else {
      return; // Skip if no meaningful change detected
    }

    const now = Date.now();
    if (now - lastSync < debounceTime) return;
    lastSync = now;

    // Only synchronize if the active window matches the editor where the cursor is moving
    if (activeEditorForSync !== sourceEditor) return;

    const targetEditors = vscode.window.visibleTextEditors.filter(
      editor => editor !== lastUserEditor
    );

    for (const targetEditor of targetEditors) {
      const targetLine = Math.min(activePos.line, targetEditor.document.lineCount - 1);
      const targetPosition = new vscode.Position(targetLine, 0);
      const newSelection = new vscode.Selection(targetPosition, targetPosition);

      targetEditor.selections = [newSelection];
      targetEditor.revealRange(
        new vscode.Range(targetPosition, targetPosition),
        vscode.TextEditorRevealType.InCenter
      );
    }
  });

  vscode.window.onDidChangeActiveTextEditor(editor => {
    if (!editor || !syncEnabled) return;

    // Set the currently active editor as the master synchronization reference
    activeEditorForSync = editor;
  });
}

function updateStatusBar() {
  if (syncEnabled) {
    statusBarItem.text = '$(sync) Cursor Sync: On';
    statusBarItem.tooltip = 'Click to turn OFF cursor synchronization';
  } else {
    statusBarItem.text = '$(circle-slash) Cursor Sync: Off';
    statusBarItem.tooltip = 'Click to turn ON cursor synchronization';
  }
}

export function deactivate() {}