
export class HistorialNode {
    constructor(type, node, id, pos, selected, links) {
        this.type = type;
        this.node = node;
        this.id = id;
        this.pos = pos;
        this.links = links;
        this.selected = selected;
        this.prev = null;
    }
}

export class Stack {
    constructor() {
        this.first = null;
        this.last = null;
        this.length = 0;
    }

    push(type, node, id, pos, selected, links) {
        const nodo = new HistorialNode(type, node, id, pos, selected, links);
        if (this.length == 0) {
            this.first = nodo;
        } else {
            const last = this.last;
            nodo.prev = last;
        }
        this.last = nodo;
        this.length++;
        return this;
    }

    pop() {
        if (!this.length) return null;

        const nodo = this.last;

        if (this.length == 1) {
            this.first = null;
            this.last = null;
        } else {
            this.last = nodo.prev;
        }

        this.length--;

        return nodo;
    }
}