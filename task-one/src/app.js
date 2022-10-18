import FileTree from './fileTree';

export function createFileTree(input) {
  const fileTree = new FileTree();

  const newArr = [];
  for (let i = 0; i < input.length; i++) {
    if (!input[i].parentId) {
      newArr.push(input[i]);
      input.splice(input[i], 1);
    }
  }
const inputData = input.sort((a, b) => a.id - b.id)

  const result = [...newArr, ...inputData];

  for (const inputNode of result) {
    const parentNode = inputNode.parentId
      ? fileTree.findNodeById(inputNode.parentId)
      : null;

    fileTree.createNode(
      inputNode.id,
      inputNode.name,
      inputNode.type,
      parentNode
    );
  }

  return fileTree;
}