import { get } from "http";
import { getCategories } from "../models/category/index.js";

const getNav = async (user) => {
  const categories = await getCategories();
  let nav = "<nav><ul>";
  categories.forEach((row) => {
    const id = row.category_id;
    const name = row.category_name;
    nav += `<li><a href="/category/view/${id}">${name}</a></li>`;
  });
  if (user) {
    nav += `
        <li><a href="/About">About Me</a></li>
        <li><a href="/account/login">login</a></li>
        <li><a href="/account/register">register</a></li>
        <li><a href="/account/logout">logout</a></li>
        <li><a href="/game/add">Add Game</a></li>
        <li><a href="/category/add">Add Category</a></li>
        <li><a href="/category/delete">Delete Category</a></li>
    </ul>
    </nav>`;
  } else {
    nav += `

        <li><a href="/About">About Me</a></li>
        <li><a href="/account/login">login</a></li>
        <li><a href="/account/register">register</a></li>

        </ul>
    </nav>`;
  }

  return nav;
};

const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    req.flash("error", "You must be logged in to access this page.");
    return res.redirect("/login");
  } else {
    // create a variable to check if the user is logged in
    res.locals.user = true;
  }
  next();
};

export { getNav, requireAuth };
