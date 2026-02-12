class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
        this.x = 0;
        this.y = 0;
    }
}

class AVL {
    constructor() {
        this.root = null;
    }

    height(n) {
        return n ? n.height : 0;
    }

    updateHeight(n) {
        n.height = 1 + Math.max(this.height(n.left), this.height(n.right));
    }

    balance(n) {
        return this.height(n.left) - this.height(n.right);
    }

    rotateRight(y) {
        let x = y.left;
        let t2 = x.right;

        x.right = y;
        y.left = t2;

        this.updateHeight(y);
        this.updateHeight(x);

        return x;
    }

    rotateLeft(x) {
        let y = x.right;
        let t2 = y.left;

        y.left = x;
        x.right = t2;

        this.updateHeight(x);
        this.updateHeight(y);

        return y;
    }

    insert(node, value) {
        if (!node) return new Node(value);

        if (value < node.value)
            node.left = this.insert(node.left, value);
        else if (value > node.value)
            node.right = this.insert(node.right, value);
        else
            return node;

        this.updateHeight(node);

        let balance = this.balance(node);

        if (balance > 1 && value < node.left.value)
            return this.rotateRight(node);

        if (balance < -1 && value > node.right.value)
            return this.rotateLeft(node);

        if (balance > 1 && value > node.left.value) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }

        if (balance < -1 && value < node.right.value) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }

    insertValue(value) {
        this.root = this.insert(this.root, value);
    }
}

const tree = new AVL();

document.getElementById("insertBtn").addEventListener("click", insertValue);
document.getElementById("resetBtn").addEventListener("click", resetTree);

function insertValue() {
    const val = parseInt(document.getElementById("valueInput").value);
    if (!isNaN(val)) {
        tree.insertValue(val);
        render();
        document.getElementById("valueInput").value = "";
    }
}

function resetTree() {
    tree.root = null;
    render();
}

function render() {
    const container = document.getElementById("tree-container");
    const svg = document.getElementById("lines");

    container.querySelectorAll(".node").forEach(n => n.remove());
    svg.innerHTML = "";

    if (!tree.root) return;

    const width = container.clientWidth;
    const levelHeight = 120;

    function assignPositions(node, depth, minX, maxX) {
        if (!node) return;

        const midX = (minX + maxX) / 2;

        node.x = midX;
        node.y = depth * levelHeight + 80;

        assignPositions(node.left, depth + 1, minX, midX);
        assignPositions(node.right, depth + 1, midX, maxX);
    }

    assignPositions(tree.root, 0, 0, width);

    function draw(node) {
        if (!node) return;

        if (node.left) drawLine(node, node.left);
        if (node.right) drawLine(node, node.right);

        draw(node.left);
        draw(node.right);

        const div = document.createElement("div");
        div.className = "node";
        div.style.left = (node.x - 27) + "px";
        div.style.top = node.y + "px";
        div.innerHTML = node.value + `<small>h:${node.height}</small>`;

        container.appendChild(div);
    }

    function drawLine(parent, child) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

        // center of parent node
        const parentX = parent.x;
        const parentY = parent.y + 27;

        // center top of child node
        const childX = child.x;
        const childY = child.y;

        line.setAttribute("x1", parentX);
        line.setAttribute("y1", parentY);
        line.setAttribute("x2", childX);
        line.setAttribute("y2", childY);

        line.setAttribute("stroke", "#b07d62");
        line.setAttribute("stroke-width", "2");

        svg.appendChild(line);
    }

    draw(tree.root);
}
