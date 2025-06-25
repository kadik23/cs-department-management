import "./bootstrap";
import Layout from "@/layout/Layout";
import AdminLayout from "@/layout/admin/AdminLayout";
import TeacherLayout from "@/layout/teacher/TeacherLayout";
import StudentLayout from "@/layout/student/StudentLayout";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { Provider } from 'react-redux';
import { store } from './state/store';

createInertiaApp({
    title: (title) => (title ? `${title} - CS Department Management` : "CS Department Management"),
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        let page = pages[`./Pages/${name}.jsx`];
        
        let layout = Layout;
        
        if (name.startsWith('Admin/') || name.startsWith('admin/')) {
            layout = AdminLayout;
        } else if (name.startsWith('Teacher/') || name.startsWith('teacher/')) {
            layout = TeacherLayout;
        } else if (name.startsWith('Student/') || name.startsWith('student/')) {
            layout = StudentLayout;
        }
        
        page.default.layout = page.default.layout || ((page) => <layout children={page} />);
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
