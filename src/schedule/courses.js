class CourseRegister {
  constructor() {
  }

  refresh() {
    const self = this;
    async function getreg() {
      return await self.getRegisterdCourse();
    }
    if (typeof this.registerd_course == "undefined") {
      getreg().then((courses) => {
        if (typeof courses == "undefined"){
          courses = []
        }
        this.registerd_course = courses
        this.showAddCourseButtonIfNeeded()
      })
    } else {
      this.showAddCourseButtonIfNeeded()
    }
  }

  showAddCourseButtonIfNeeded() {
    const registerd_ids = this.registerd_course.map(function (item) {
      return item.id;
    });
    const self = this;
    const courses = document.getElementsByClassName("course_summary");
    const days = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日"];
    const times = ["１時限", "２時限", "３時限", "４時限", "５時限", "６時限", "７時限"]
    const all_course_times = []
    days.forEach((day) => {
      times.forEach((time) => {
        all_course_times.push(day+time)
      })
    })
    Array.from(courses).forEach((element, index) => {
      const content = element.querySelectorAll(".pad-box-mini");
      const id = content[0].querySelector("a").href;
      const title = content[0].getElementsByTagName("a")[0].textContent;
      const desc = content[content.length - 1].textContent;
      if (days.some((el) => desc.includes(el))) {
        let course_time = []
        all_course_times.forEach((time,index) => {
          if (desc.includes(time)){
            course_time.push(index)
          }
        })
        let button = document.createElement("button");
        if (registerd_ids.includes(id)) {
          button.innerText = "時間割から消去";
        } else {
          button.innerText = "時間割に追加";
        }
        button["class"] = "solex_add_schedule";
        button.onclick = function (event) {
          event.stopPropagation();

          let course = {
            id: id,
            title: title,
            time: course_time,
            desc: desc
          };
          if (button.innerText == "時間割に追加") {
            button.innerText = "時間割から消去";
            self.addCourse(course);
          } else {
            button.innerText = "時間割に追加";
            self.deleteCourse(course);
          }
        };
        courses[index].querySelector(".course_text").appendChild(button);
      }
    });
  }

  addCourse(course) {
    this.registerd_course.push(course);
    chrome.storage.local.set(
      { courses: this.registerd_course },
      function () {}
    );
  }

  deleteCourse(course) {
    const index = this.registerd_course
      .map(function (el) {
        return el.id;
      })
      .indexOf(course.id);
    this.registerd_course.splice(index, 1);
    chrome.storage.local.set(
      { courses: this.registerd_course },
      function () {}
    );
  }

  getRegisterdCourse() {
    const self = this;
    return new Promise((resolve) => {
      chrome.storage.local.get(["courses"], function (result) {
        if (typeof result === "undefined") {
          self.generateCourseFormat();
          resolve([]);
        } else {
          resolve(result.courses);
        }
      });
    });
  }

  generateCourseFormat() {
    chrome.storage.local.set({ courses: [] }, function () {});
  }
}

const DS = new CourseRegister();
const MAX_RETRY_COUNT_FIND_DIFF_CONTAINER = 20;
let retry_counter = 0;
let old_titles = Array.from(
  document.getElementsByClassName("course_summary")
).map(function (item) {
  return item
    .querySelector(".pad-box-mini")
    .getElementsByTagName("a")[0].textContent;
});
let set_interval_id;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "TabUpdated") {
    clearInterval(set_interval_id);
    delete set_interval_id;
    set_interval_id = setInterval(waitCourseLoaded, 500);
  }
});
function waitCourseLoaded() {
  retry_counter++;
  if (retry_counter > MAX_RETRY_COUNT_FIND_DIFF_CONTAINER) {
    clearInterval(set_interval_id);
    delete set_interval_id;
  }
  new_titles = Array.from(
    document.getElementsByClassName("course_summary")
  ).map(function (item) {
    return item
      .querySelector(".pad-box-mini")
      .getElementsByTagName("a")[0].textContent;
  });
  if (old_titles != new_titles) {
    if (typeof set_interval_id != "undefined") {
      clearInterval(set_interval_id);
      delete set_interval_id;
      old_titles = new_titles;
      DS.refresh();
    } else {
      return diff_container_elements;
    }
  }
}