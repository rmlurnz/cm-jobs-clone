import { pubsub } from "./pubsub.js";

export const jobHandler = {
  container: null,
  categories: null,
  sort_order: "latest",
  init: (job_data, container) => {
    jobHandler.container = container;

    // default sort jobs by most recent
    let by_recent = job_data.jobs.toSorted((a, b) => {
      if (a.created > b.created) return -1;
      if (a.created < b.created) return 1;
      return 0;
    });

    // create categories from "most recent" sorted data
    let sorted_cats = by_recent.reduce((dept_jobs, job) => {
      const department = job.department;
      if (dept_jobs[department] == null) dept_jobs[department] = [];
      dept_jobs[department].push(job);
      return dept_jobs;
    }, {});

    jobHandler.categories = sorted_cats;

    document
      .getElementById("job-category-sort")
      .addEventListener("change", (e) => {
        jobHandler.sort_order = e.target.value;
        jobHandler.renderCategories();
      });

    jobHandler.renderCategories();
  },
  renderCategories: () => {
    // reset div contents
    jobHandler.container.innerHTML = "";

    let sorted;

    if (jobHandler.sort_order == "latest") {
      // uses default "most recent" sort
      sorted = Object.keys(jobHandler.categories);
    } else {
      // sort categories alphabetically
      sorted = Object.keys(jobHandler.categories).sort();
    }

    sorted.forEach((key) => {
      let div = document.createElement("div");

      // set sub-category
      let sub_cat = document.createElement("span");
      sub_cat.appendChild(
        document.createTextNode(jobHandler.categories[key][0].sub_category)
      );
      div.appendChild(sub_cat);

      // set department
      let dept = document.createElement("h3");
      dept.appendChild(document.createTextNode(key));
      div.appendChild(dept);

      // set # of jobs
      let num_jobs = document.createElement("span");
      num_jobs.appendChild(
        document.createTextNode(
          jobHandler.categories[key].length +
            " Job" +
            (jobHandler.categories[key].length > 1 ? "s" : "")
        )
      );
      num_jobs.setAttribute("class", "job-count");
      div.appendChild(num_jobs);

      div.setAttribute("class", "job-category");
      div.setAttribute("category", key);

      div.addEventListener("click", (e) => {
        pubsub.publish("categoryClicked", jobHandler.categories[key]);
      });

      jobHandler.container.appendChild(div);
    });
  },
};
