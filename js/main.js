import { jobHandler } from "./job-handler.js";
import { modal } from "./job-list-modal.js";

// path to data file that contains jobs
const JOBS_DATA = "./data/jobs.json";

// // container elements used to initialize components
const jobCategoryElement = document.getElementById("job-category-container");
const modalElement = document.getElementById("modal-container");

// make "API call" to local file used as DB
fetch(JOBS_DATA)
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error("There was an issue retrieving job data");
  })
  .then((data) => {
    modal.init(modalElement);
    jobHandler.init(data, jobCategoryElement);
    jobHandler.renderCategories();
  })
  .catch((error) => {
    console.log(error);
  });

// nav menu icon animation
document.getElementById("menu-button").addEventListener("click", () => {
  let squares = document.getElementsByClassName("square");
  for (let i = 0; i < squares.length; i++) {
    squares[i].classList.toggle("clicked");
  }
});
