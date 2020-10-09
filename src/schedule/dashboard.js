class DashboardSchedule {
  constructor() {
    this.addScheduleDiv();
      let self = this;
    async function getreg() {
      return await self.getRegisterdCourse();
    }
      getreg().then((courses) => {
          if (typeof courses === "undefined") {
            courses = []
          }
      let time_table = Array(35)
        .fill()
        .map(() => []);
      time_table.forEach((e, index) => {
        courses.forEach((elm, index2) => {
          if (elm["time"].includes(index)) {
            time_table[index].push(elm);
          }
        });
      });
      this.time_table = time_table;
      this.generateScheduleTable();
    });
  }

  addScheduleDiv() {
    let scheduleDiv = document.createElement("div");
    scheduleDiv.innerHTML = `
        <div id="schedule_header_container" class="ic-Dashboard-header"><div class="large ic-Dashboard-header__layout"><h1 class="ic-Dashboard-header__title"><span class="hidden-phone">時間割</span></h1></div></div>
        `;
    scheduleDiv.id = "schedule";
    document.querySelector("#content").appendChild(scheduleDiv);
  }

  generateScheduleTable() {
    let div = document.createElement("div");
    div.innerHTML = `
        <br>
        <table border="1" width="100%" cellspacing="0" cellpadding="5" bordercolor="#333333">
    <tr>
    <th></th>
    <th width="19%">月</th>
    <th width="19%">火</th>
    <th width="19%">水</th>
    <th width="19%">木</th>
    <th width="19%">金</th>
    </tr>
    <tr>
    <th width="5%" height="80px">１限</th>
    <th width="19%">` + this.classString(0) + `</th>
    <th width="19%">` + this.classString(7) + `</th>
    <th width="19%">` + this.classString(14) + `</th>
    <th width="19%">` + this.classString(21) + `</th>
    <th width="19%">` + this.classString(28) + `</th>
    </tr>
    <tr>
    <th width="5%" height="80px">２限</th>
    <th width="19%">` + this.classString(1) + `</th>
    <th width="19%">` + this.classString(8) + `</th>
    <th width="19%">` + this.classString(15) + `</th>
    <th width="19%">` + this.classString(22) + `</th>
    <th width="19%">` + this.classString(29) + `</th>
    </tr>
    <tr>
    <th width="5%" height="80px">３限</th>
    <th width="19%">` + this.classString(2) + `</th>
    <th width="19%">` + this.classString(9) + `</th>
    <th width="19%">` + this.classString(16) + `</th>
    <th width="19%">` + this.classString(23) + `</th>
    <th width="19%">` + this.classString(30) + `</th>
    </tr>
    <tr>
    <th width="5%" height="80px">４限</th>
    <th width="19%">` + this.classString(3) + `</th>
    <th width="19%">` + this.classString(10) + `</th>
    <th width="19%">` + this.classString(17) + `</th>
    <th width="19%">` + this.classString(24) + `</th>
    <th width="19%">` + this.classString(31) + `</th>
    </tr>
    <tr>
    <th width="5%" height="80px">５限</th>
    <th width="19%">` + this.classString(4) + `</th>
    <th width="19%">` + this.classString(11) + `</th>
    <th width="19%">` + this.classString(18) + `</th>
    <th width="19%">` + this.classString(25) + `</th>
    <th width="19%">` + this.classString(32) + `</th>
    </tr>
    <tr>
    <th width="5%" height="80px">６限</th>
    <th width="19%">` + this.classString(5) + `</th>
    <th width="19%">` + this.classString(12) + `</th>
    <th width="19%">` + this.classString(19) + `</th>
    <th width="19%">` + this.classString(26) + `</th>
    <th width="19%">` + this.classString(33) + `</th>
    </tr>
    <tr>
    <th width="5%" height="80px">７限</th>
    <th width="19%">` + this.classString(6) + `</th>
    <th width="19%">` + this.classString(13) + `</th>
    <th width="19%">` + this.classString(20) + `</th>
    <th width="19%">` + this.classString(27) + `</th>
    <th width="19%">` + this.classString(34) + `</th>
    </tr>
    </table>
    `;
    document.querySelector("#schedule").appendChild(div);
  }
    
    classString(index) {
        let tagstr = ""
        this.time_table[index].forEach((el, index) => {
            if (index != 0) {
                tagstr += "<br>"
            }
            tagstr += "<div><a href='" + el.id + "'>" + el.title +"</a></div>"
        })
        return tagstr
  }

  getRegisterdCourse() {
    const self = this;
    return new Promise((resolve) => {
      chrome.storage.local.get(["courses"], function (result) {
        if (typeof result === "undefined") {
          resolve([]);
        } else {
          resolve(result.courses);
        }
      });
    });
  }
}

const DS = new DashboardSchedule();
