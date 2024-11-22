import { pubsub } from "./pubsub.js";

export const modal = {
  container: null,
  init: (modalElement) => {
    modal.container = modalElement;

    document.getElementById("close-modal").addEventListener("click", () => {
      modal.closeModal();
    });
    window.onclick = (e) => {
      if (e.target == modal.container) {
        modal.closeModal();
      }
    };

    pubsub.subscribe("categoryClicked", modal.openModal);
  },
  openModal: (jobs) => {
    console.log(jobs);

    let subcat = document.getElementById("sub-category");
    subcat.innerHTML = jobs[0].sub_category + ".";

    let dept = document.getElementById("department");
    dept.innerHTML = jobs[0].department;

    // LEFT OFF HERE - need to iterate over jobs from category and render as list on modal

    modal.container.style.display = "block";
  },
  closeModal: () => {
    modal.container.style.display = "none";
  },
};
