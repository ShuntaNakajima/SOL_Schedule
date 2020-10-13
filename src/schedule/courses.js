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
        button.classList.add('solex_schedule_button')
        if (registerd_ids.includes(id)) {
          button.innerText = "時間割から消去";
          button.classList.add("solex_delete_schedule_button")
        } else {
          button.innerText = "時間割に追加";
          button.classList.remove("solex_delete_schedule_button")
        }
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
            button.classList.add("solex_delete_schedule_button")
            self.addCourse(course);
          } else {
            button.innerText = "時間割に追加";
            button.classList.remove("solex_delete_schedule_button")
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

DS.refresh();

const targetNode = document.getElementById('content');
const config = { attributes: true, childList: true, subtree: true };
const callback = function (mutationsList, observer) {
  observer.disconnect()
  DS.showAddCourseButtonIfNeeded()
  observer.observe(targetNode, config)
};
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
