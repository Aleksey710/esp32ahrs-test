
export function showContent(item) {
    const content = document.getElementById('content');

    content.innerHTML = `
        <h2>${item.title}</h2>
        <p>ID: ${item.id}</p>
    `;
}

export function createTree(container, items) {
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'tree-item';
        div.textContent = item.title;

        container.appendChild(div);

        // если есть дети
        if (item.children) {
            const children = document.createElement('div');
            children.className = 'tree-children';

            div.appendChild(children);

            div.onclick = (e) => {
                e.stopPropagation();
                div.classList.toggle('open');
            };

            createTree(children, item.children);
        } else {
            // лист дерева
            div.onclick = (e) => {
                e.stopPropagation();
                showContent(item);
            };
        }
    });
}
