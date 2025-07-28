// ======== Struktur Data ========
let items = [];               // Array
let undoStack = [];           // Stack
let graph = {};               // Graph
let categoryTree = {          // Tree
  name: "Barang",
  children: [
    { name: "Makanan", children: [] },
    { name: "Minuman", children: [] }
  ]
};

// ======== Tambah Item ========
function addItem() {
  const input = document.getElementById("itemInput");
  const name = input.value.trim();
  if (!name) return alert("Nama item tidak boleh kosong!");

  items.push(name);
  undoStack.push({ action: 'delete', name });

  // Default masuk kategori "Makanan"
  categoryTree.children[0].children.push({ name, children: [] });

  // Tambah relasi ke item sebelumnya
  if (items.length > 1) {
    const prev = items[items.length - 2];
    graph[prev] = graph[prev] || [];
    graph[prev].push(name);
    graph[name] = graph[name] || [];
    graph[name].push(prev);
  }

  input.value = "";
  updateAllViews();
}

// ======== Undo Aksi ========
function undoItem() {
  if (undoStack.length === 0) return alert("Tidak ada aksi untuk di-undo.");

  const last = undoStack.pop();
  if (last.action === 'delete') {
    items = items.filter(i => i !== last.name);

    // Hapus dari tree
    categoryTree.children.forEach(cat => {
      cat.children = cat.children.filter(child => child.name !== last.name);
    });

    // Hapus dari graph
    delete graph[last.name];
    for (let key in graph) {
      graph[key] = graph[key].filter(i => i !== last.name);
    }

    updateAllViews();
  }
}

// ======== Pencarian ========
function searchItem() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const filtered = items.filter(i => i.toLowerCase().includes(keyword));
  renderItemList(filtered);
}

// ======== View: Item List ========
function renderItemList(list) {
  const listElem = document.getElementById("itemList");
  listElem.innerHTML = "";
  list.forEach(item => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = item;
    listElem.appendChild(li);
  });
}

// ======== View: Tree (Kategori) ========
function renderTree(node, indent = 0, container = null) {
  if (!container) container = document.getElementById("treeView");
  if (indent === 0) container.innerHTML = "";

  const line = document.createElement("div");
  line.innerHTML = "&nbsp;".repeat(indent * 4) + "• " + node.name;
  container.appendChild(line);

  if (node.children) {
    node.children.forEach(child => renderTree(child, indent + 1, container));
  }
}

// ======== View: Graph (Relasi) ========
function renderGraph() {
  const container = document.getElementById("graphView");
  container.innerHTML = "";
  for (let item in graph) {
    const line = document.createElement("div");
    line.textContent = `${item} → ${graph[item].join(", ")}`;
    container.appendChild(line);
  }
}

// ======== Update Semua View ========
function updateAllViews() {
  renderItemList(items);
  renderTree(categoryTree);
  renderGraph();
}

// ======== Inisialisasi ========
updateAllViews();
