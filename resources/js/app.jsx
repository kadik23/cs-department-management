import "./bootstrap";
import Layout from "@/layout/Layout";
import AdminLayout from "@/layout/admin/AdminLayout";
import TeacherLayout from "@/layout/teacher/TeacherLayout";
import StudentLayout from "@/layout/student/StudentLayout";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { Provider } from 'react-redux';
import { store } from './state/store';
import "@css/aside.css";
import "@css/style.css";
import "@css/accounts.css";
import "@css/admin.css";
import "@css/aside.css";
import "@css/custom-select.css";
import "@css/dialogue.css";
import "@css/list.css";
import "@css/search.css";
import "@css/tabs.css";
import "@css/forms.css";
import "@css/buttons.css";
import "@css/card-box.css";

createInertiaApp({
    title: (title) => (title ? `${title} - CS Department Management` : "CS Department Management"),
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        let page = pages[`./Pages/${name}.jsx`];
        
        let LayoutComponent = Layout;
        
        if (name.startsWith('Admin/') || name.startsWith('admin/')) {
            LayoutComponent = AdminLayout;
        } else if (name.startsWith('Teacher/') || name.startsWith('teacher/')) {
            LayoutComponent = TeacherLayout;
        } else if (name.startsWith('Student/') || name.startsWith('student/')) {
            LayoutComponent = StudentLayout;
        }
        
        page.default.layout = page.default.layout || ((page) => <LayoutComponent>{page}</LayoutComponent>);
        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <Provider store={store}>
                <App {...props} />
            </Provider>
        );
    },
    progress: {
        color: "#0c4a6e",
        showSpinner: true,
    },
});
