import * as path from 'path';
import * as vscode from 'vscode';

/**
 * Activate the extension
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "search-in-folder" is now active!');

  // ========== 功能1：在当前文件夹中搜索 ==========
  const searchInFolderDisposable = vscode.commands.registerCommand(
    'search-in-folder.searchInCurrentFolder',
    async () => {
      const editor = vscode.window.activeTextEditor;

      // 如果没有活动编辑器，直接打开搜索面板
      if (!editor) {
        await vscode.commands.executeCommand('workbench.action.findInFiles');
        return;
      }

      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      // 如果没有选中文字，直接打开搜索面板
      if (!selectedText) {
        await vscode.commands.executeCommand('workbench.action.findInFiles');
        return;
      }

      const currentFilePath = editor.document.uri.fsPath;
      const currentDir = path.dirname(currentFilePath);
      const workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri);

      if (!workspaceFolder) {
        // 没有工作区时，也在工作区搜索
        await executeSearch(selectedText, '**', 'workspace');
        return;
      }

      const workspaceRoot = workspaceFolder.uri.fsPath;
      const relativePath = path.relative(workspaceRoot, currentDir);
      const normalizedPath = relativePath.replace(/\\/g, '/');
      const includePattern = normalizedPath ? `${normalizedPath}/**` : '**';

      await executeSearch(selectedText, includePattern, normalizedPath || 'workspace root');
    }
  );

  // ========== 功能2：在整个工作区搜索（增强版 - 清除路径限制）==========
  const searchInWorkspaceDisposable = vscode.commands.registerCommand(
    'search-in-folder.searchInWorkspace',
    async () => {
      const editor = vscode.window.activeTextEditor;

      // 如果没有活动编辑器，直接打开搜索面板
      if (!editor) {
        await vscode.commands.executeCommand('workbench.action.findInFiles');
        return;
      }

      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      // 如果没有选中文字，直接打开搜索面板
      if (!selectedText) {
        await vscode.commands.executeCommand('workbench.action.findInFiles');
        return;
      }

      // 执行全工作区搜索，明确清除路径限制
      await executeGlobalSearch(selectedText);
    }
  );

  context.subscriptions.push(searchInFolderDisposable, searchInWorkspaceDisposable);
}

/**
 * 封装本地搜索执行逻辑（带路径限制）
 */
async function executeSearch(
  query: string,
  includePattern: string,
  locationDescription: string
): Promise<void> {
  await vscode.commands.executeCommand('workbench.action.findInFiles', {
    query,
    filesToInclude: includePattern,
    triggerSearch: true,
    isCaseSensitive: false,
    matchWholeWord: false,
    isRegex: false,
    useExcludeSettingsAndIgnoreFiles: true,
  });

  await postSearchActions(locationDescription, query);
}

/**
 * 全局搜索（清除所有路径限制）
 */
async function executeGlobalSearch(query: string): Promise<void> {
  // 关键：将 filesToInclude 和 filesToExclude 显式设为 ""，彻底清空路径限制
  await vscode.commands.executeCommand('workbench.action.findInFiles', {
    query,
    filesToInclude: '', // 强制清空包含路径
    filesToExclude: '', // 强制清空排除路径
    triggerSearch: true,
    isCaseSensitive: false,
    matchWholeWord: false,
    isRegex: false,
    useExcludeSettingsAndIgnoreFiles: true,
  });

  await postSearchActions('entire workspace (no path restrictions)', query);
}

/**
 * 搜索后的通用操作
 */
async function postSearchActions(locationDescription: string, query: string): Promise<void> {
  const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

  try {
    // 确保搜索面板打开
    await vscode.commands.executeCommand('workbench.view.search');

    // 等待搜索结果渲染
    await delay(6 * 1000);

    // 折叠所有搜索结果节点
    await vscode.commands.executeCommand('list.collapseAll');
  } catch (err) {
    // 静默处理错误，避免打断用户流程
  }

  vscode.window.showInformationMessage(`Searching for "${query}" in ${locationDescription}`);
}

/**
 * Deactivate the extension
 */
export function deactivate() {}
