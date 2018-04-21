'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "file-creator" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('fileCreator.createFile', () => {
        // The code you place here will be executed every time your command is executed
        const current_editor = vscode.window.activeTextEditor;
        if (!current_editor) {
            return;
        }

        const current_file = current_editor.document.fileName;
        const current_folder = path.dirname(current_file);

        const file_path = current_editor.document.getText(current_editor.selection).trim();

        const file = createFile(current_folder, file_path);
        // Display a message box to the user
        vscode.window.setStatusBarMessage(file,1000);
        openFile();
    });

    vscode.commands.registerCommand('fileCreator.openFile', () => openFile());

    context.subscriptions.push(disposable);
}

function createFile(current_folder : string, selection :string) {
    const folders = selection.substring(0, selection.lastIndexOf('/'));

    mkdirp.sync(current_folder + '/' + folders);
    
    const file_exists = fs.existsSync(current_folder + '/' + selection.trim());
    if(!file_exists){
        fs.writeFileSync(current_folder + '/' + selection, '');
        return selection + "Created";
    }else {
        return "File already exists";
    }
}

function openFile() {
    const current_editor = vscode.window.activeTextEditor;
    if (!current_editor) {
        return;
    }
    const selection = current_editor.document.getText(current_editor.selection).trim();

    const current_file = current_editor.document.fileName;
    const current_folder = path.dirname(current_file);
    const myPath = path.resolve(current_folder,selection);
    vscode.workspace.openTextDocument(myPath).then(doc => {
        const column = vscode.window.visibleTextEditors.findIndex(x => (x.document === doc));
        vscode.window.showTextDocument(doc, {preview : false, viewColumn: column});
    });
    vscode.window.setStatusBarMessage("Opened " + selection, 1000);
}
// this method is called when your extension is deactivated
export function deactivate() {
}