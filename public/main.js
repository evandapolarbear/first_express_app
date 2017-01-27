const update = document.getElementById("update-button");
const dlt = document.getElementsByClassName("delete");

for (var i = 0; i < dlt.length; i++){
  const name = dlt[i].name;

  dlt[i].addEventListener('click',() =>{ deleteItem(name); });
}

update.addEventListener('click', () => {
  updateDates("now", "tomorrow");
});

const updateToNow = document.getElementById("update-now-button");
updateToNow.addEventListener('click', () => {
  updateDates("tomorrow", "now");
});

function updateDates(oldDate, newDate) {
  fetch('list', {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      dateToChange: oldDate,
      newDueDate: newDate
    })
  }).then(res => {
    if (res.ok) {
      return res.json;
    }
  }).then(jsonData => {
    // console.log("fetch fired and completed");
    window.location.reload(true);
  });
}

function deleteItem(name){
  fetch('list', {
    method: "delete",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      itemToDelete: name
    }),
  }).then(res => {
    if (res.ok) {
      return res.json;
    }
  }).then(jsonData => {
    window.location.reload(true);
  });
}
//fetch returns a Promise Object
