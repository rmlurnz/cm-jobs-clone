import { pubsub } from "./pubsub.js";

export const modal = {
  container: null,
  all_jobs: null,
  selected_city: "None",
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
    document
      .getElementById("job-city-filter")
      .addEventListener("change", (e) => {
        modal.selected_city = e.target.value;
        modal.populateJobList();
      });

    pubsub.subscribe("categoryClicked", modal.openModal);
  },
  openModal: (jobs) => {
    modal.all_jobs = jobs;

    let subcat = document.getElementById("sub-category");
    subcat.innerHTML = jobs[0].sub_category + ".";

    let dept = document.getElementById("department");
    dept.innerHTML = jobs[0].department;

    let cities = [];

    jobs.forEach((job) => {
      // extract cities for location filter
      if (!cities.includes(job.location)) {
        cities.push(job.location);
      }
    });

    // populate cities for filter
    modal.populateFilterDropdown(cities);

    // populate viewable jobs
    modal.populateJobList();

    modal.container.style.display = "block";
  },
  closeModal: () => {
    modal.container.style.display = "none";
  },
  populateJobList: () => {
    let job_list = document.getElementById("location-jobs-list");
    job_list.innerHTML = "";
    modal.all_jobs.forEach((job) => {
      if (
        modal.selected_city == "None" ||
        job.location == modal.selected_city
      ) {
        let li = document.createElement("li");
        let span = document.createElement("span");
        let b = document.createElement("b");
        b.appendChild(document.createTextNode(job.title));
        span.appendChild(b);
        span.appendChild(document.createTextNode(" in " + job.location));
        li.appendChild(span);
        job_list.appendChild(li);
      }
    });
  },
  populateFilterDropdown: (cities) => {
    let filter = document.getElementById("job-city-filter");
    // reset filter options
    filter.options.length = 0;
    // add default option
    let def = document.createElement("option");
    def.value = "None";
    def.innerHTML = "Filter by location...";
    def.setAttribute("class", "option");
    filter.appendChild(def);
    // add available cities
    cities.forEach((city) => {
      let opt = document.createElement("option");
      opt.value = city;
      opt.innerHTML = city;
      opt.setAttribute("class", "option");
      filter.appendChild(opt);
    });
  },
};
