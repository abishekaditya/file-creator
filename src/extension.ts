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
    let disposable = vscode.commands.registerCommand('extension.createFile', () => {
        // The code you place here will be executed every time your command is executed
        let current_editor = vscode.window.activeTextEditor;
        if (!current_editor) {
            return;
        }

        let current_file = current_editor.document.fileName;
        let current_folder = path.dirname(current_file);

        let file_path = current_editor.document.getText(current_editor.selection);

        let file = create_file(current_folder, file_path);
        // Display a message box to the user
        vscode.window.showInformationMessage(file);
    });

    context.subscriptions.push(disposable);
}

function create_file(current_folder : string, selection :string) {
    let folders = selection.substring(0, selection.lastIndexOf('/'));

    mkdirp.sync(current_folder + '/' + folders);
    
    let file_exists = fs.existsSync(current_folder + '/' + selection);
    if(!file_exists){
        fs.writeFileSync(current_folder + '/' + selection, '');
        return current_folder + '/' + selection;
    }else {
        return "File already exists";
    }
}
// this method is called when your extension is deactivated
export function deactivate() {
}