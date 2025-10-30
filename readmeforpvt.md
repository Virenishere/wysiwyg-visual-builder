# WYSIWYG Visual Builder - Project Architecture

This document provides a detailed overview of the project architecture for the WYSIWYG Visual Builder. It is intended for research and development purposes, offering a deep dive into the project's structure, components, state management, and overall design.

## 1. High-Level Architecture

The WYSIWYG Visual Builder is a web-based application that allows users to create and design web pages using a drag-and-drop interface. The core technologies used in this project are:

- **Framework:** [Next.js](https://nextjs.org/) (using the App Router)
- **UI Library:** [React](https://react.dev/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Drag and Drop:** [react-rnd](https://github.com/bokuweb/react-rnd)
- **Rich Text Editing:** A custom Rich Text Editor implementation.

The application follows a component-based architecture, with a clear separation of concerns between different parts of the application. State management is centralized using Zustand, which provides a simple and powerful way to manage the application's state.

## 2. How It All Connects: A Simple Explanation

Imagine the application as a big LEGO castle. The castle is your web page, and the LEGO bricks are the different elements like text, images, and buttons.

- **The Canvas:** The main area where you build your page is the "canvas." This is where you see your LEGO castle taking shape.

- **The LEGO Bricks (Components):** Each element you can add to the page (a button, a picture, a block of text) is a React component. These are like the individual LEGO bricks.

- **The Big Blueprint (Zustand Store):** All the information about your LEGO castle is stored in a single, central place called the "Zustand store." This is like a blueprint that knows where every single LEGO brick is, what color it is, and what it's supposed to do.

- **The Control Panels (Editor Panels):** When you click on a LEGO brick, a control panel appears. This panel lets you change the properties of that brick, like its color, size, or position. In our application, these are the "Element Properties Panel" and the "Box Properties Panel."

**Here's how it all works together:**

1.  **You Click an Element:** When you click on a text block on the canvas, the application tells the Zustand store, "Hey, the user just selected this text block!"

2.  **The Store Updates:** The Zustand store updates itself to remember which element is currently selected.

3.  **The UI Reacts:** The "Element Properties Panel" is always listening to the Zustand store. When it sees that a new element has been selected, it immediately updates to show the properties of that element.

4.  **You Make a Change:** You use the properties panel to change the color of the text to red.

5.  **The Panel Updates the Store:** The properties panel tells the Zustand store, "The user wants to change the color of the selected text block to red."

6.  **The Store Updates Again:** The Zustand store updates the information for that text block, changing its color to red.

7.  **The Canvas Updates:** The text block component on the canvas is also listening to the Zustand store. When it sees that its color has changed in the store, it automatically re-renders itself with the new red color.

This cycle of **Action -> Store Update -> UI Reacts** is the fundamental principle that governs how the entire application works. It ensures that the UI is always in sync with the application's state, and it makes the code much easier to manage and understand.

## 3. The Div Editing Panel: `BoxPropertiesPanel.jsx`

The `BoxPropertiesPanel.jsx` component is a key part of the editor interface. It allows users to edit the properties of a "box" or a container element. A box is a special type of component that can hold other elements, like a `div` in HTML.

**How it Works:**

1.  **Getting the Selected Box:** The component subscribes to the Zustand store and gets the `selectedBoxId` and the list of `parents` (sections). It then finds the currently selected box from the store.

2.  **Displaying Properties:** Once it has the selected box, it renders the `PositionSize` component (from `src/components/ElementPropertiesPanelSection/PositionSize.jsx`). This component provides the UI for editing the box's position (top, left) and size (width, height).

3.  **Updating the Box:** When you change a value in the `PositionSize` component (e.g., by dragging the size handles or typing in a new width), it calls the `updateRnd` function from the Zustand store. This function updates the properties of the selected box in the store.

4.  **The UI Updates:** As soon as the box's data is updated in the store, the `RndBox.jsx` component on the canvas (which represents the box) automatically re-renders with the new position and size.

## 4. The Custom Rich Text Editor

The application features a custom-built rich text editor that allows for advanced text formatting. This editor is not a third-party library but is built from scratch using standard web technologies.

**Core Components:**

- **`RichTextEditor.jsx`:** This is the main component for the rich text editor. It uses a standard `<div>` element with the `contentEditable` attribute set to `true`. This is what makes the `div` behave like a text editor.

- **`Toolbar.jsx`:** This component provides the toolbar with all the formatting buttons (bold, italic, underline, etc.).

**How it Works:**

1.  **The `contentEditable` Div:** The `RichTextEditor.jsx` component renders a `div` that the user can type into directly. Because `contentEditable` is true, the browser provides basic text editing capabilities.

2.  **The Toolbar:** The `Toolbar.jsx` component is a separate React component that is displayed when the user is editing text. It contains a series of buttons, each corresponding to a specific formatting action.

3.  **Applying Formatting:** When you click a button on the toolbar (e.g., the "Bold" button), it doesn't directly change the text. Instead, it calls a function in the `RichTextEditor.jsx` component.

4.  **The Selection API:** The `RichTextEditor.jsx` component then uses the browser's built-in **Selection API** to apply the formatting. The Selection API allows you to get information about the text that the user has selected and to make changes to it.

    For example, when you click the "Bold" button, the `RichTextEditor.jsx` component gets the currently selected text and wraps it in a `<strong>` tag or applies a `font-weight: bold` style to it.

5.  **State Management:** As the user types or applies formatting, the `RichTextEditor.jsx` component continuously updates the content of the editor in the Zustand store. This ensures that the changes are saved and that the editor's content is always in sync with the rest of the application.

By building the rich text editor from scratch, we have full control over its appearance and functionality, and we can tailor it to the specific needs of the application.

## 5. Folder and File Structure

The project's folder structure is organized as follows:

```
/
├── .next/
├── node_modules/
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/
│   │   ├── edit/
│   │   ├── preview/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── loading.js
│   │   └── page.js
│   ├── components/
│   ├── pages/
│   ├── store/
│   ├── templates/
│   └── utils/
├── .eslintrc.json
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
└── README.md
```

### 5.1. `src/app/`

This directory contains the core of the Next.js application, following the App Router paradigm.

- **`layout.js`:** The root layout of the application. It sets up the basic HTML structure, including the `<html>` and `<body>` tags, and applies global fonts and styles.
- **`page.js`:** The entry point for the main page of the application. It renders the `HomePage` component.
- **`globals.css`:** Global CSS file, primarily used for Tailwind CSS setup.
- **`edit/[templateName]/page.jsx`:** A dynamic route for editing a specific template. The `templateName` is passed as a parameter in the URL.
- **`preview/[templateName]/page.jsx`:** A dynamic route for previewing a template.

### 5.2. `src/components/`

This is one of the most important directories in the project, containing all the React components used to build the user interface. The components are further organized into subdirectories based on their functionality.

- **`DraggableElementSection/`:** Components that can be dragged and dropped onto the canvas, such as `ButtonElement`, `ImageElement`, and `TextElement`.
- **`EditorPanelSection/`:** Components related to the main editor interface, including the left and right panels, and modals for saving and downloading code.
- **`ElementPropertiesPanelSection/`:** Components for editing the properties of a selected element, such as `PositionSize`, `Spacing`, `Typography`, and `BorderEffects`.
- **`PreviewComponentSection/`:** Components responsible for rendering the preview of the created page.
- **`PropertiesTabSection/`:** Components for the different tabs in the right-hand side editor panel.
- **`SectionPropertiesPanel/`:** Components for editing the properties of a section.
- **`TemplateSelectorSection/`:** Components for selecting and managing templates.

### 5.3. `src/store/`

This directory contains the Zustand state management setup.

- **`UseDivStore.js`:** The main Zustand store. It combines different "slices" of the state into a single store. It also uses the `persist` middleware to save the state to `localStorage`.
- **`slices/`:** Each file in this directory defines a "slice" of the application state. This helps to organize the state management logic and keep the main store file clean.
    - `boxSlice.js`: Manages the state of individual "boxes" or containers within a section.
    - `elementSlice.js`: Manages the state of individual elements (buttons, text, etc.).
    - `layoutSlice.js`: Manages the overall layout of the page.
    - `parentSlice.js`: Manages the state of "parents" or sections.
    - `selectionSlice.js`: Manages the currently selected element.
    - `templateSlice.js`: Manages the state of templates.
    - `uiSlice.js`: Manages the state of the UI, such as the visibility of panels and modals.

### 5.4. `src/templates/`

This directory contains predefined templates that users can start with. Each template is a JavaScript file that exports a template object.

### 5.5. `src/utils/`

This directory contains utility functions and constants that are used throughout the application.

## 6. State Management with Zustand

The application uses Zustand for state management. The main store is created in `src/store/UseDivStore.js` by combining multiple slices. Each slice is responsible for a specific part of the application's state.

**Example: `boxSlice.js`**

This slice would typically define state and actions related to "boxes" (containers), such as:

- `boxes`: An array of box objects.
- `addBox`: An action to add a new box.
- `updateBox`: An action to update the properties of a box.
- `deleteBox`: An action to delete a box.

This separation of concerns makes the state management logic easier to understand and maintain.

## 7. Component Deep Dive

Let's take a closer look at a few key components to understand how they work.

### 7.1. `DraggableElement.jsx`

This component is a wrapper around the `react-rnd` library, which provides the drag-and-drop functionality. It takes an element object as a prop and renders the appropriate component from the `DraggableElementSection` directory. It also handles the logic for updating the element's position and size in the Zustand store when it is dragged or resized.

### 7.2. `ElementPropertiesPanel.jsx`

This component displays the properties of the currently selected element. It gets the selected element from the `selectionSlice` in the Zustand store and renders the appropriate property editing components from the `ElementPropertiesPanelSection` directory. When a property is changed, it dispatches an action to update the element's state in the `elementSlice`.

### 7.3. `PreviewComponent.jsx`

This component is responsible for rendering the final preview of the page. It gets the layout, sections, and elements from the Zustand store and renders them as a static HTML page. This component is used in the preview route (`/preview/[templateName]`).

## 8. Routing and Navigation

The application uses the Next.js App Router for routing.

- **`/`:** The main page, which displays the `HomePage` component.
- **`/edit/[templateName]`:** The editor page for a specific template. The `templateName` is used to load the corresponding template data from the `src/templates` directory.
- **`/preview/[templateName]`:** The preview page for a specific template.

## 9. Styling

The application is styled using Tailwind CSS. The `tailwind.config.js` file is configured to purge unused CSS in production, and the `globals.css` file contains the base Tailwind CSS styles. Components are styled using Tailwind's utility classes.

## 10. Conclusion

The WYSIWYG Visual Builder is a well-structured and modular application that leverages the power of Next.js, React, and Zustand to provide a flexible and extensible platform for building web pages. The component-based architecture, centralized state management, and clear separation of concerns make the codebase easy to understand, maintain, and extend.
