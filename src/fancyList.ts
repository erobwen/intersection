
interface Operation<T> {
  do: (list: FancyList<T>) => void
  undo: (list: FancyList<T>) => void
  redo: (list: FancyList<T>) => void
}

class Add<T> implements Operation<T> {
  element: T;
  box: Box<T>|null;
  
  constructor(element: T) {
    this.element = element;
    this.box = null;
  }

  do(list: FancyList<T>) {
    this.box = new Box<T>(this.element)
    this.redo(list);
  }

  redo(list: FancyList<T>) {
    list.contents.push(this.box as Box<T>);
  }

  undo(list: FancyList<T>) {
    list.contents.pop();
  }
}

class Remove<T> implements Operation<T> {
  index: number;
  box: Box<T>;
  
  constructor(index: number, box: Box<T>) {
    this.index = index;
    this.box = box;
  }

  do(list: FancyList<T>) {
    this.redo(list);
  }

  redo(list: FancyList<T>) {
    list.contents.splice(this.index, 1);
  }

  undo(list: FancyList<T>) {
    list.contents.splice(this.index, 0, this.box);
  }
}

class SetMetadata<T> implements Operation<T> {
  index: number;
  data: string;
  oldData: string|null; 
  
  constructor(index: number, data: string) {
    this.index = index;
    this.data = data;
    this.oldData = null
  }

  do(list: FancyList<T>) {
    this.redo(list);
  }

  redo(list: FancyList<T>) {
    const box = list.contents[this.index];
    this.oldData = box.metadata;
    box.metadata = this.data;
  }

  undo(list: FancyList<T>) {
    const box = list.contents[this.index];
    box.metadata = this.oldData;
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
    const operation = new Remove<T>(index, this.contents[index]);
    this.operations.push(operation);
    operation.do(this);
  }

  setMetadata(index: number, data: string) {
    const operation = new SetMetadata<T>(index, data);
    this.operations.push(operation);
    operation.do(this);
  }

  getMetadata(index: number) {
    return this.contents[index].metadata;
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
    operation.redo(this);
  }
}