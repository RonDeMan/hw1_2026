## Introduction
We will implement a simple front-end app that shows posts. The app uses a JSON server, which uses a JSON file as a database and displays the posts to the user, split into pages. The posts in this homework are "Did you know?" fun facts about web development.

1. A JSON server is initialized using a JSON file to hold the posts. The JSON file is provided in this repository.
2. The client sees the posts, which are split into pages: 10 posts per page. Initially, only the first page is shown.
3. The UI component used is called pagination.
4. When a specific page loads, only the posts for that page should be sent from the server for efficiency reasons.

**No external pagination libraries are allowed.**
## Submission
1. Submission is in pairs, but starting alone is better for practice.
2. Coding: 70%, Questions: 30%.
3. Your submitted git repo should be *private*, please add 'barashd@post.bgu.ac.il' and 'Gal-Fadlon' to the list of collaborators.
4. Do not use external libraries that provide the pagination component. If in doubt, contact the course staff.
5. Deadline: 13.4.26, end of day.
6. Additionally, solve the [theoretical questions](https://docs.google.com/forms/d/e/1FAIpQLSeF7AGqsFPJ2HKhKynXOBnSozFgfqcko1u_hmIrauv8so3tvQ/viewform?usp=header).
7. In the course Moodle's submission form, please fill the repository `ssh clone link` (see image inside the form).
8. Use TypeScript, and follow the linter's warnings (see eslint below).
9. The ex1 forum is open for questions in Moodle.
10. Git repository content:
    1. Aim for a minimal repository size that can be cloned and installed: most of the files in github should be code and package dependencies (add package.json, index.html).
    2. Don't submit (add to git)  node_modules dir, package-lock.json, or notes json files. Read about .gitignore and see the example in the repo.
11. If a certain case is not described here, you're free to code it as you see fit.
12. The submission commit will be tagged as `submission_hw1`: [git tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging)
    1. `git tag -a submission_hw1 -m "msg"`
    2. `git push origin --tags`
    3. if you need to tag a new commit as the solution, first delete `git tag -d submission_hw1` or add `--force` to the previous commands.
13. To test your submission, run the presubmission script (in GitHub). A submission that does not pass the presubmission script gets a 0 score automatically.
    1. For example: `bash presubmission.sh git@github.com:bgu-frontend/hw1_2026.git`
14. It is recommended to add tests to your code; it will usually result in higher grades during the automatic testing.  See 'Playwright' below.

## AI

You are allowed to use AI assistants, but you must use them responsibly:

1. **Start alone.** Write the code yourself first. Use AI for the last stage — polishing, debugging, or checking your work. Not for regenerating components. This is how you actually learn.
2. **You must understand every bit of your code.** The file structure, component hierarchy, code organization, and every line — you need to be able to explain all of it. If you cannot explain your code in the oral exam, the coding grade will be reduced accordingly.
3. **Both students in each pair will be tested** in an oral exam. The tester may ask about anything in your code, and will not ask the same questions to both partners.

### Github
HW1 will be submitted via Github. Please create a user with your email address.
To securely update files from your machine by SSH authentication:
https://docs.github.com/en/authentication/connecting-to-github-with-ssh/checking-for-existing-ssh-keys

## Prerequisites
### Tools
1. Chrome browser (comes with DevTools built-in).
2. Visual Studio Code
3. Optional: Visual Studio Code [debugger](https://code.visualstudio.com/docs/)
3. [Vite](https://vitejs.dev/guide/)
4. Git (Start here: [Atlassian](https://www.atlassian.com/git/tutorials/))



### Json server - example code to get notes from the server
In the following, `active_page` is the currently displayed page, and `POSTS_PER_PAGE` is 10, 'notes_url' is 'http://localhost:3001/notes'.
```js

    useEffect(() => {
        const promise = axios.get(NOTES_URL, {
            params: {
              _page: activePage,
              _per_page: POSTS_PER_PAGE
            }});
        promise.then(response => { 
            // fill here
        }).catch(error => { console.log("Encountered an error:" + error)});
    }, []); //ignore lint warnings in this line
```

See:
https://www.npmjs.com/package/json-server
For pagination, you'll need request:
```
_page
_per_page
_limit
```
query parameters. 

### Starting a new project
1. Initiate a new repository or clone this one.
2. Start a new React project using Vite. Run:
```bash
npm create vite@latest <your_app_name> -- --template react-ts
cd my-app
npm install
``` 
3. Install json-server locally:
```bash
npm install json-server@0.17.4
```
4. Copy `data/notes.json` from this repository into your project's `./data/` directory.
5. Avoid installing your project's packages globally.

We use npm to install packages locally in our project, package.json file tracks those. When you install packages via npm globally, a package might be installed on your machine but your package.json won't have it, so other machines won't install it and fail to run your code.

## Code
Aim for short components, with organized component directory hierarchy. See vite's initial project structure as an example.


### Run the server with an input JSON file:
```bash
npx json-server --port 3001 --watch ./data/notes.json
```

### Run your code:
```bash
cd <vite_project_path>
npm run dev
```
## Front end Description:
1. The front-end should connect to the server, and get posts (just) for the current page.
2. Each page has 10 posts.
3. add [pagination](https://www.w3schools.com/css/css3_pagination.asp) UI element to the website. 

### Pagination
1. The minimum number of page buttons is 1.
2. The maximum number of page buttons is 5.
3. The first page is 1.
4. The active page button is shown in **bold**.
5. The 4 buttons with "First, Prev, Next, Last" text on them always appear.
6. Which page numbers should be shown on the buttons? Let `a` be the current page, `n` = total pages:
    1. If `n <= 5`: show buttons `[1, ..., n]`
    2. If `n >= 6`:
        1. if `a <3` : show buttons `[1,2,3,4,5]`
        2. If `3 <= a <= (n-2)`: show buttons `[a-2, a-1, a, a+1, a+2]`
        3. If `a > (n-2)`: show buttons `[n-4, n-3, n-2, n-1, n]`
7. Disable irrelevant page buttons:
    1. `previous` is disabled if we're at the first page.
    2. `next` is disabled if we're at the last page.
    3. The current page number: if we're at page number 1, disable page button `1`.

## Test requirements
1. Each note should be of [class name](https://www.w3schools.com/html/html_classes.asp) **"note"**.
2. A note must get the unique ID from the database and use it as the [html id attribute](https://www.w3schools.com/html/html_id.asp).
3. Pagination buttons:
    1. Navigation buttons should have [html name attribute](https://www.w3schools.com/tags/att_name.asp) **"first"**, **"previous"**, **"next"**, **"last"**.
    2. Page buttons should have [html name attribute](https://www.w3schools.com/tags/att_name.asp) **"page-\<target_page_number\>"**

Each post should be displayed with the following HTML structure:

```html
<div class="note" id="<database_id>">
    <h2><note_title></h2>
    <small>By <author_name></small>
    <br>
    <note_content>
</div>
```

### Example HTML


```html
<div class="note" id="1">
    <h2>JavaScript Was Created in 10 Days</h2>
    <small>By JavaScript History</small>
    <br>
    Did you know? In May 1995, Brendan Eich was hired by Netscape...
</div>

```

```html
<div>
    <button name="first">First</button>
    <button name="previous">Previous</button>
    <button name="page-1">1</button>
    <button name="page-2">2</button>
    <button name="page-3">3</button>
    <button name="page-4">4</button>
    <button name="page-5">5</button>
    <button name="next">Next</button>
    <button name="last">Last</button>
</div>
```

### CSS Styling

Your app must be visually styled — not raw browser defaults.

- Notes must have a visible background color (not transparent/white), padding, and spacing between them (e.g., using `border`, `box-shadow`, or `background-color`).
- Pagination buttons must be styled and horizontally centered (e.g., using `flexbox`).
- Set a font family other than the browser default (e.g., `font-family: Arial, Helvetica, sans-serif` or use [Google Fonts](https://fonts.google.com/)).

For inspiration on styled UI components (buttons, cards, loaders), check out [uiverse.io](https://uiverse.io/).

## Suggested implementation steps
1. Show a list of posts (tip: start from a local variable holding the post list).
2. Connect to the server (tip: start by getting all posts).
3. Add pagination in the UI (tip: plan the component tree: who is calling who? This suggests a React component hierarchy).
4. Optimize: when rendering a page, send only the data needed now instead of the entire database.
5. Tip: write a test plan. How would you test someone else's project? This suggests implementation priorities.
## Using ESLint

1. **Install ESLint**:
```bash
npm install --save-dev eslint
```

2. **Place `.eslintrc.json`** in your project root (same level as `package.json`).

3. **Run ESLint**:
```bash
npm run lint
```

4. **Ensure `lint` script exists** in `package.json`:
```json
"scripts": {
  "lint": "eslint ."
}
```



## Using Playwright for Testing

To use Playwright for testing in your project, read [writing-tests](https://playwright.dev/docs/writing-tests). The presubmission script contains an example test you can reference.

## Git workflow for pairs

For full Git documentation, see [Pro Git Book](https://git-scm.com/book/en/v2). A typical workflow when working in pairs on this homework:

1. One partner creates the repo and pushes the initial project:
   ```bash
   git init
   git add .
   git commit -m "initial project setup"
   git remote add origin git@github.com:<your-repo>.git
   git push -u origin main
   ```
2. The other partner clones the repo:
   ```bash
   git clone git@github.com:<your-repo>.git
   ```
3. Before starting work, pull the latest changes:
   ```bash
   git pull
   ```
4. Make changes, then commit and push:
   ```bash
   git add src/App.tsx src/components/Pagination.tsx
   git commit -m "add pagination component"
   git push
   ```
5. If your partner pushed changes since your last pull, pull first and resolve any conflicts:
   ```bash
   git pull
   # if there are conflicts, open the conflicting files, resolve them, then:
   git add <resolved-files>
   git commit -m "resolve merge conflict in App.tsx"
   git push
   ```
6. When you're done, tag your final submission and push the tag:
   ```bash
   git tag -a submission_hw1 -m "final submission"
   git push origin --tags
   ```

## Quick clean
in `package.json`:
```json
"scripts": {
  "clean": "rm -rf node_modules package-lock.json"
}
```
