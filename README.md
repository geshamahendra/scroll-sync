# Synchronized Multi-Window Cursor

A lightweight VS Code extension designed to synchronize cursor movement across multiple visible editor windows. Perfect for side-by-side comparisons of log files, data dumps, or documents that require line-by-line validation.

## Features

* **Simultaneous Scrolling & Navigation:** Move your cursor in the active window, and all other visible windows will automatically jump to the exact same line number.
* **Debounced Execution:** Smooth synchronization that prevents performance lags during rapid scrolling or navigation.
* **Status Bar Toggle:** Easily turn the synchronization on or off with a single click from the Status Bar.
* **Smart Boundary Control:** Dynamically handles files of unequal lengths by anchoring the target cursor safely at the last line of the shorter file.

## How to Use

1. Open the files you want to compare side-by-side using VS Code split editors (`Ctrl+\` or `Cmd+\`).
2. Look at the **Status Bar** (bottom left corner). You will see **`Cursor Sync: On`**.
3. Click or navigate through the active file. The adjacent windows will instantly align to match the active line.
4. To temporarily pause synchronization, click the Status Bar item to switch it to **`Cursor Sync: Off`**.

## Extension Settings

This extension contributes the following commands:

* `extension.toggleCursorSync`: Toggles the cursor synchronization state between Enabled and Disabled.

## Known Issues

* Selection synchronization (highlighting text blocks across multiple windows simultaneously) is not currently supported. The extension focuses specifically on line position synchronization.

---

**Enjoying the extension?** Feedback and contributions are always welcome!