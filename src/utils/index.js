import { getClassifications } from '../models/index.js';

const getNav = async () => {
    const classifications = await getClassifications();
    let nav = '<nav><ul>';
    classifications.forEach((row) => {
        const id = row.classification_id;
        const name = row.classification_name;
        nav += `<li><a href="/category/view/${id}">${name}</a></li>`
    });
    return `
    ${nav}
        <li><a href="/classification/add">add type</a></li>
        <li><a href="/classification/delete">delete type</a></li>
        <li><a href="/category/add">Add game</a></li>
        <li><a href="/About">About Me</a></li>
        </ul>
    </nav>`;
};

export { getNav };
