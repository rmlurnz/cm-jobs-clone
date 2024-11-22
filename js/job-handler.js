import { pubsub } from "./pubsub.js";

export const jobHandler = {
  data: null,
  categories: null,
  init: (job_data) => {
    jobHandler.data = job_data;

    let categories = jobHandler.data.jobs.reduce((categories, job) => {
      const department = job.department;
      if (categories[department] == null) categories[department] = [];
      categories[department].push(job);
      return categories;
    }, {});

    jobHandler.categories = categories;
  },
  renderCategories: (container) => {
    for (const [key, value] of Object.entries(jobHandler.categories)) {
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

      container.appendChild(div);
    }
  },
};
