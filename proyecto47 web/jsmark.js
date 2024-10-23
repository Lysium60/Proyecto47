 // Definición de la estructura de un nodo
 class Node {
    constructor(id, content) {
        this.id = id;
        this.content = content;
        this.children = [];
        this.style = {
            bold: false,
            italic: false,
            underline: false,
            color: '#000000'
        };
        this.link = null;
        this.collapsed = false;
        this.files = []; // Almacena objetos File
    }
}

// Clase principal para manejar el mapa mental
class MindMap {
    constructor() {
        this.rootNode = new Node(0, 'Idea Principal');
        this.render();
        this.setupEventListeners();
        this.setupTooltips();
    }

    // Renderiza todo el mapa mental
    render() {
        const mindMapContainer = document.getElementById('mindMap');
        mindMapContainer.innerHTML = this.renderNode(this.rootNode);
        this.setupSortable(mindMapContainer);
    }

    // Renderiza un nodo individual y sus hijos
    renderNode(node) {
        let html = `
            <div class="node ${node.collapsed ? 'collapsed' : ''}" id="node-${node.id}" role="treeitem" aria-expanded="${!node.collapsed}">
                <div class="node-content">
                    <span class="drag-handle" aria-hidden="true"><i class="fas fa-grip-vertical"></i></span>
                    <span class="me-2" style="${this.getNodeStyle(node)}">${node.content}</span>
                    <div class="node-buttons">
                        <input type="text" class="form-control form-control-sm me-2" placeholder="Nueva idea" style="max-width: 150px;" aria-label="Nueva idea">
                        <button class="btn btn-sm btn-outline-primary" onclick="mindMap.addChild(${node.id})" aria-label="Añadir hijo" data-bs-toggle="tooltip" title="Añadir hijo">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="mindMap.removeNode(${node.id})" aria-label="Eliminar nodo" data-bs-toggle="tooltip" title="Eliminar nodo">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="mindMap.editNode(${node.id})" aria-label="Editar nodo" data-bs-toggle="tooltip" title="Editar nodo">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="mindMap.toggleStyle(${node.id}, 'bold')" aria-label="Alternar negrita" data-bs-toggle="tooltip" title="Alternar negrita">
                            <i class="fas fa-bold"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="mindMap.toggleStyle(${node.id}, 'italic')" aria-label="Alternar cursiva" data-bs-toggle="tooltip" title="Alternar cursiva">
                            <i class="fas fa-italic"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="mindMap.toggleStyle(${node.id}, 'underline')" aria-label="Alternar subrayado" data-bs-toggle="tooltip" title="Alternar subrayado">
                            <i class="fas fa-underline"></i>
                        </button>
                        <input type="color" class="color-picker" value="${node.style.color}" onchange="mindMap.changeColor(${node.id}, this.value)" aria-label="Cambiar color" data-bs-toggle="tooltip" title="Cambiar color">
                        <button class="btn btn-sm btn-outline-primary" onclick="mindMap.addLink(${node.id})" aria-label="Añadir enlace" data-bs-toggle="tooltip" title="Añadir enlace">
                            <i class="fas fa-link"></i>
                        </button>
                        <input type="file" id="files-${node.id}" class="d-none" multiple onchange="mindMap.handleFileUpload(${node.id}, this.files)">
                        <button class="btn btn-sm btn-outline-secondary" onclick="document.getElementById('files-${node.id}').click()" aria-label="Subir archivos" data-bs-toggle="tooltip" title="Subir archivos">
                            <i class="fas fa-file-upload"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="mindMap.toggleCollapse(${node.id})" aria-label="Colapsar/Expandir" data-bs-toggle="tooltip" title="Colapsar/Expandir">
                            <i class="fas ${node.collapsed ? 'fa-plus' : 'fa-minus'}"></i>
                        </button>
                    </div>
                </div>
                ${this.renderFileList(node)}
                <div class="children">
                    ${node.children.map(child => this.renderNode(child)).join('')}
                </div>
            </div>
        `;
        return html;
    }

    // Renderiza la lista de archivos adjuntos
    renderFileList(node) {
        if (node.files.length === 0) return '';
        let fileListHtml = '<div class="file-list">';
        for (let file of node.files) {
            fileListHtml += `<span class="file-item">${file.name}</span>`;
        }
        fileListHtml += '</div>';
        return fileListHtml;
    }

    // Configura Sortable para permitir arrastrar y soltar
    setupSortable(container) {
        new Sortable(container, {
            group: 'nested',
            animation: 150,
            fallbackOnBody: true,
            swapThreshold: 0.65,
            handle: '.drag-handle',
            onEnd: (evt) => {
                this.updateNodeStructure(evt.from, evt.to, evt.oldIndex, evt.newIndex);
            }
        });

        container.querySelectorAll('.children').forEach(el => {
            new Sortable(el, {
                group: 'nested',
                animation: 150,
                fallbackOnBody: true,
                swapThreshold: 0.65,
                handle: '.drag-handle',
                onEnd: (evt) => {
                    this.updateNodeStructure(evt.from, evt.to, evt.oldIndex, evt.newIndex);
                }
            });
        });
    }

    // Actualiza la estructura de nodos después de arrastrar y soltar
    updateNodeStructure(fromEl, toEl, oldIndex, newIndex) {
        const fromNodeId = fromEl.closest('.node').id.split('-')[1];
        const toNodeId = toEl.closest('.node').id.split('-')[1];
        const fromNode = this.findNode(this.rootNode, parseInt(fromNodeId));
        const toNode = this.findNode(this.rootNode, parseInt(toNodeId));
        
        if (fromNode && toNode) {
            const [movedNode] = fromNode.children.splice(oldIndex, 1);
            toNode.children.splice(newIndex, 0, movedNode);
            this.render();
        }
    }

    // Obtiene los estilos CSS para un nodo
    getNodeStyle(node) {
        return `
            font-weight: ${node.style.bold ? 'bold' : 'normal'};
            font-style: ${node.style.italic ? 'italic' : 'normal'};
            text-decoration: ${node.style.underline ? 'underline' : 'none'};
            color: ${node.style.color};
        `;
    }

    // Añade un nuevo nodo hijo
    addChild(parentId) {
        const parentNode = this.findNode(this.rootNode, parentId);
        if (parentNode) {
            const newContent = document.querySelector(`#node-${parentId} input[type="text"]`).value;
            if (newContent) {
                const newNode = new Node(Date.now(), newContent);
                parentNode.children.push(newNode);
                this.render();
            }
        }
    }

    // Elimina un nodo
    removeNode(id) {
        if (id === 0) return; // No permitir eliminar el nodo raíz
        if (confirm('¿Estás seguro de que quieres eliminar este nodo y todos sus hijos?')) {
            this.rootNode = this.removeNodeRecursive(this.rootNode, id);
            this.render();
        }
    }

    removeNodeRecursive(node, id) {
        node.children = node.children.filter(child => child.id !== id);
        node.children = node.children.map(child => this.removeNodeRecursive(child, id));
        return node;
    }

    // Edita el contenido de un nodo
    editNode(id) {
        const node = this.findNode(this.rootNode, id);
        if (node) {
            const newContent = prompt('Editar nodo:', node.content);
            if (newContent !== null) {
                node.content = newContent;
                this.render();
            }
        }
    }

    // Cambia los estilos de un nodo (negrita, cursiva, subrayado)
    toggleStyle(id, style) {
        const node = this.findNode(this.rootNode, id);
        if (node) {
            node.style[style] = !node.style[style];
            this.render();
        }
    }

    // Cambia el color de un nodo
    changeColor(id, color) {
        const node = this.findNode(this.rootNode, id);
        if (node) {
            node.style.color = color;
            this.render();
        }
    }

    // Añade un enlace a un nodo
    addLink(id) {
        const  node = this.findNode(this.rootNode, id);
        if (node) {
            const link = prompt('Añadir enlace:', node.link || '');
            if (link !== null) {
                node.link = link || null;
                this.render();
            }
        }
    }

    // Maneja la subida de múltiples archivos
    handleFileUpload(id, files) {
        const node = this.findNode(this.rootNode, id);
        if (node) {
            node.files = [...node.files, ...Array.from(files)];
            this.render();
        }
    }

    // Colapsa o expande un nodo
    toggleCollapse(id) {
        const node = this.findNode(this.rootNode, id);
        if (node) {
            node.collapsed = !node.collapsed;
            this.render();
        }
    }

    // Busca un nodo por su ID
    findNode(node, id) {
        if (node.id === id) return node;
        for (let child of node.children) {
            const found = this.findNode(child, id);
            if (found) return found;
        }
        return null;
    }

    // Guarda el mapa mental en localStorage
    save() {
        const saveData = JSON.stringify(this.rootNode);
        localStorage.setItem('mindMap', saveData);
        alert('Mapa mental guardado!');
    }

    // Carga el mapa mental desde localStorage
    load() {
        const savedMap = localStorage.getItem('mindMap');
        if (savedMap) {
            this.rootNode = JSON.parse(savedMap);
            this.render();
        }
    }

    // Reinicia el mapa mental
    reset() {
        if (confirm('¿Estás seguro de que quieres reiniciar el mapa mental? Se perderán todos los datos.')) {
            this.rootNode = new Node(0, 'Idea Principal');
            localStorage.removeItem('mindMap');
            this.render();
        }
    }

    // Exporta el mapa mental a formato Markdown
    async exportToMarkdown() {
        const folderName = prompt('Ingrese el nombre de la carpeta para guardar los archivos:', 'mi_mapa_mental');
        if (!folderName) return;

        const zip = new JSZip();
        const folder = zip.folder(folderName);
        let markdown = await this.generateMarkdown(this.rootNode, folder, folderName);
        folder.file('mapa-mental.md', markdown);
        
        const content = await zip.generateAsync({type: 'blob'});
        const url = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${folderName}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert(`
            Mapa mental exportado con éxito.
            Instrucciones:
            1. Descomprime el archivo ${folderName}.zip
            2. Abre la carpeta ${folderName}
            3. Abre el archivo mapa-mental.md con un visor de Markdown
            4. Los archivos adjuntos están en la misma carpeta y pueden ser abiertos directamente desde los enlaces en el Markdown
            5. Asegúrate de mantener todos los archivos en la misma carpeta para que los enlaces funcionen correctamente
            6. Si usas Visual Studio Code, instala la extensión "Markdown Preview Enhanced" para una mejor visualización
        `);
    }

    // Genera el Markdown para un nodo y sus hijos
    async generateMarkdown(node, folder, folderName, level = 0) {
        let markdown = '  '.repeat(level) + '- ';
        
        if (node.style.bold) markdown += '**';
        if (node.style.italic) markdown += '_';
        if (node.style.underline) markdown += '<u>';
        
        markdown += node.link ? `[${node.content}](${node.link})` : node.content;
        
        if (node.style.underline) markdown += '</u>';
        if (node.style.italic) markdown += '_';
        if (node.style.bold) markdown += '**';
        
        if (node.style.color !== '#000000') {
            markdown += ` <span style="color: ${node.style.color}">■</span>`;
        }
        
        if (node.files.length > 0) {
            markdown += '\n' + '  '.repeat(level + 1) + 'Archivos adjuntos:\n';
            for (let file of node.files) {
                const safeFileName = this.getSafeFileName(file.name);
                await folder.file(safeFileName, file, {binary: true});
                markdown += '  '.repeat(level + 2) + `- [${file.name}](./${encodeURIComponent(safeFileName)})\n`;
            }
        }
        
        markdown += '\n';
        
        if (!node.collapsed) {
            for (let child of node.children) {
                markdown += await this.generateMarkdown(child, folder, folderName, level + 1);
            }
        }
        
        return markdown;
    }

    // Obtiene un nombre de archivo seguro para usar en rutas
    getSafeFileName(fileName) {
        const extension = fileName.split('.').pop();
        const baseName = fileName.slice(0, fileName.lastIndexOf('.'));
        const safeBaseName = baseName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        return `${safeBaseName}_${Date.now()}.${extension}`;
    }

    // Configura los event listeners para los botones principales
    setupEventListeners() {
        document.getElementById('saveButton').addEventListener('click', () => this.save());
        document.getElementById('exportButton').addEventListener('click', () => this.exportToMarkdown());
        document.getElementById('resetButton').addEventListener('click', () => this.reset());
    }

    // Configura los tooltips de Bootstrap
    setupTooltips() {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// Inicializa el mapa mental
const mindMap = new MindMap();

// Carga el mapa mental guardado (si existe)
mindMap.load();