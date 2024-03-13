import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('inline-completions demo started');

    const suggestions = {
        'a': ['apple', 'air'],
        'b': ['banana', 'beer'],
        'c': ['cloud', 'color'],
        'o':['orange ']
    };

    const provider: vscode.InlineCompletionItemProvider = {
        async provideInlineCompletionItems(document, position, context, token) {
            console.log('provideInlineCompletionItems triggered');
            const lineText = document.lineAt(position.line).text;
            console.log(`Line text: ${lineText}`);
            const wordRange = document.getWordRangeAtPosition(position, /\w+/);
            console.log(`Word range: ${wordRange}`);
            const currentWord = wordRange ? document.getText(wordRange) : '';
            console.log(`Current word: ${currentWord}`);

            const matchingItems: vscode.InlineCompletionItem[] = [];
            for (const [letter, items] of Object.entries(suggestions)) {
                console.log(`Checking letter: ${letter}`);
                if (currentWord.startsWith(letter)) {
                    console.log(`Current word starts with ${letter}`);
                    const filteredItems = items.filter(item => item.startsWith(currentWord));
                    console.log(`Filtered items: ${filteredItems}`);
                    matchingItems.push(...filteredItems.map(text => ({
                        insertText: text,
                        range: wordRange || new vscode.Range(position, position.translate(0, currentWord.length))
                    })));
                }
            }

            console.log(`Matching items: ${matchingItems.map(item => item.insertText)}`);

            const result: vscode.InlineCompletionList = {
                items: matchingItems,
                commands: []
            };

            console.log(`Returning result: ${result.items.map(item => item.insertText)}`);

            return result;
        }
    };

    vscode.languages.registerInlineCompletionItemProvider({ pattern: '**' }, provider);
}