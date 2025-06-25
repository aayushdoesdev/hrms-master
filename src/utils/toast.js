import { createVNode, render } from "vue";
import Toast from "@/components/Toast.vue";

export const toast = {
  success(message, title = "Success", duration = 3000) {
    this.show("success", message, title, duration);
  },
  error(message, title = "Error", duration = 3000) {
    this.show("error", message, title, duration);
  },
  warning(message, title = "Warning", duration = 3000) {
    this.show("warning", message, title, duration);
  },
  show(type, message, title, duration) {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const vnode = createVNode(Toast, {
      type,
      message,
      title,
      duration,
      onVanish: () => {
        render(null, container);
        container.remove();
      },
    });

    render(vnode, container);
  },
};
