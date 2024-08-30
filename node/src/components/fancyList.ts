
// class Operation<T> {
//   undo(list: FancyList<T>) {
//     throw new Error("Not implemented yet!");
//   }
// }

interface Operation<T> {
  undo: (list: FancyList<T>) => void
  do: (list: FancyList<T>) => void
}

class Add<T> implements Operation<T> {
  element: T;
  box: Box<T>|null;
  
  constructor(element: T) {
    this.element = element;
    this.box = null;
  }

  undo(list: FancyList<T>) {
    list.contents.pop();
  }

  do(list: FancyList<T>) {
    if (!this.box) {
      this.box = new Box<T>(this.element)
    }
    list.contents.push(this.box);
  }
}

class Remove<T> implements Operation<T> {
  index: number;
  box: Box<T>;
  
  constructor(index: number, box: Box<T>) {
    this.index = index;
    this.box = box;
  }

  undo(list: FancyList<T>) {
    list.contents.splice(this.index, 0, this.box);
  }

  do(list: FancyList<T>) {
    list.contents.splice(this.index, 1);
  }
}

export class Box<T> {
  metadata: string|null;
  element: T;
  constructor(element: T, metadata: string|null=null) {
    this.element = element; 
    this.metadata = metadata;
  }
}


export class FancyList<T> {
  contents: Box<T>[];

  operations: Operation<T>[];
  
  redoOperations: Operation<T>[];

  constructor() {
    this.contents = [];
    this.operations = [];
    this.redoOperations = [];
  }

  unbox(): Array<T> {
    return this.contents.map(item => item.element);
  }

  add(element: T) {
    const operation = new Add<T>(element); 
    this.operations.push(operation);
    operation.do(this);
  }

  remove(index: number) {
    const operation = new Remove(index, this.contents[index]);
    this.operations.push(operation);
    operation.do(this);
  }

  get(index: number): T {
    return this.contents[index].element;
  }

  contains(element: T): boolean {
    for (let box of this.contents) {
      if (box.element === element) {
        return true; 
      }
    }
    return false; 
  }

  size(): number {
    return this.contents.length
  }

  undo() {
    const operation: Operation<T> = (this.operations.pop() as Operation<T>);
    this.redoOperations.unshift(operation)
    operation.undo(this);
  }

  redo() {
    const operation: Operation<T> = (this.redoOperations.shift() as Operation<T>);
    this.operations.push(operation);
    operation.do(this);
  }
}