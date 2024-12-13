/** 
// [Begin Test Function]

function testFunction() {

  const mySpace = "spaces/AAAA3GgA9jk";
  postMessageWithUserCredentials(mySpace);

}
*/
// [End Test Function]

// [START chat_post_message_with_user_credentials]
/**
 * Posts a new message to the specified space on behalf of the user.
 * @param {string} spaceName The resource name of the space.

function postMessageWithUserCredentials(spaceName) {
  try {
    const message = {'text': 'Hello world!'};
    Chat.Spaces.Messages.create(message, spaceName);
  } catch (err) {
    // TODO (developer) - Handle exception
    console.log('Failed to create message with error %s for space ' + spaceName, err.message);
  }
}
// [END chat_post_message_with_user_credentials]
 */
/**
 * Get all spaces
 * List spaces to user
 * Take selected space and message text
 * Post message text to selected Space 
 

function getAllSpaces(){

  let spaceList; 

  try{
    
    spaceList = Chat.Spaces.list(); 
    console.log('Found ' + JSON.stringify(spaceList));

  } catch (err) {

    console.log('Fail' + err);

  }

}
*/

function myFunction() {

  var sectionJSON = createCustomCardSectionJSON("overdue");
  console.log("Final output");
  console.log(createCustomMessage("Louis","overdue",sectionJSON)); 

  //createCustomCardSectionJSON("today");
  //createCustomCardSectionJSON("this week");
  //createCustomCardSectionJSON("overdue");
  //createCustomCardSectionJSON("new");

}


function onMessage(event) {
  
  let messageText = event.message.text;
  const displayName = event.message.sender.displayName;

  if (messageText == "today" || messageText == "this week" || messageText == "overdue" || messageText == "new") {

    var sectionJSON = createCustomCardSectionJSON(messageText);

    //return createMessage(displayName,sectionJSON);

    console.log(displayName,messageText,sectionJSON);
    return createCustomMessage(displayName,messageText,sectionJSON);

  } else {

    return { text: "Hi I'm Task Bot 👋 here to help you manage your Google Tasks \n\n Enter one of the following options \n\n `Today` \n `This Week` \n `Overdue` \n `New`" };

  }
}

function onCardClick(event) {
  
   if(event.action.actionMethodName == "onCardClick"){

    const taskID = event.action.parameters[0].value;
    const taskListID = event.action.parameters[1].value;
    const taskAction = event.action.parameters[2].value;
    var taskTitle = "";

    if (taskAction == "complete") {

      taskTitle = completeTaskFromCard(taskID, taskListID);
      return { text: "✅  " + "*" + taskTitle + "* has been completed" };

    } else if (taskAction == "tomorrow") {

      taskTitle = tomorrowTaskFromCard(taskID, taskListID);
      return { text: "👍  " + "*" + taskTitle + "* has been updated" };

    } else if (taskAction == "nextweek") {

      taskTitle = nextWeekTaskFromCard(taskID, taskListID);
      return { text: "👍  " + "*" + taskTitle + "* has been updated" };

    } 

   } else {

    return { text: "Sorry, no tasks action found 😞" };
    //when in doubt, dump the event body to the chat using JSON.stringify(event)

   }

}

function createCustomCardSectionJSON(messageText) { 

  var taskJSON = new Array();
  var todayDate = new Date();
  todayDate.setHours(0,0,0,0);
  var nextWeekDate = getNext7DaysDate();

  const taskLists = Tasks.Tasklists.list();

  for (let i = 0; i < taskLists.items.length; i++) {
      
      const taskList = taskLists.items[i];
      const tasks = Tasks.Tasks.list(taskList.id);
    
      for (let i = 0; i < tasks.items.length; i++) {

        var getTaskJSON = false;
        
        if (tasks.items[i].due != undefined) {

          //var taskDueDateISO = new Date(tasks.items[i].due);
          
          var taskAPIDueDate = tasks.items[i].due;
          
          var taskDueYYYYMMDD = taskAPIDueDate.split("T")[0];

          var taskDueYear = taskDueYYYYMMDD.split("-")[0];
          var taskDueMonth = taskDueYYYYMMDD.split("-")[1];
          var taskDueDay = taskDueYYYYMMDD.split("-")[2];

          var taskDueDate = new Date(taskDueYear,(taskDueMonth - 1),taskDueDay);       

          if (messageText == "today" && taskDueDate.getFullYear() == todayDate.getFullYear() && taskDueDate.getMonth() == todayDate.getMonth() && taskDueDate.getDate() == todayDate.getDate()) {  

            getTaskJSON = true;
            console.log("Path found: today");

          } else if (messageText == "this week" && taskDueDate >= todayDate && taskDueDate < nextWeekDate) {  

            getTaskJSON = true;
            console.log("Path found: this week");

          } else if (messageText == "overdue" && taskDueDate < todayDate) {

            getTaskJSON = true;
            console.log("Path found: overdue");

          } 

        } else if (tasks.items[i].due == undefined) {

          if (messageText == "new") {

            getTaskJSON = true;
            console.log("Path found: new");

          }

        }

        if (getTaskJSON) {

          console.log("createCustomCardSectionJSON:\n" + taskList.title + "\n" + tasks.items[i].title + "\nDue(API):" + tasks.items[i].due + "\nToday:" + todayDate + "\nNext Week Date:" + nextWeekDate);

          taskJSON.push(getCardJSONByTask(taskList.id,tasks.items[i].id));

        }

      } 
  }

  console.log(JSON.stringify(taskJSON));

  return JSON.stringify(taskJSON);

}

/**
 * Creates a card with two widgets.
 * @param {string} displayName the sender's display name
 * @param {string} avatarUrl the URL for the sender's avatar
 * @return {Object} a card with the sender's avatar.
 */
function createMessage(displayName, sectionJSON) {

  console.log("Section JSON: \n" + sectionJSON);

  //insert if statements for for "help, new, today, week, overdue"

  var cardJSON = {
    "cardsV2": [
      {
        "cardId": "unique-card-id",
        "card": {
          "header": {
            "title": "Hi " + displayName + " 👋",
            "subtitle": "You've got some overdue or unassigned tasks listed below",
            "imageUrl":
            "",
            "imageType": "CIRCLE",
            "imageAltText": "Avatar for Sasha",
          },
          "sections": JSON.parse(sectionJSON),
        },
      }
    ],
  }

  console.log("CardV2: \n" + JSON.stringify(cardJSON));
  return cardJSON;
}

function createCustomMessage(displayName,messageText,sectionJSON) {

  console.log("Section JSON: \n" + sectionJSON);

  //insert if statements for for "help, new, today, week, overdue"
  var title = "Hi " + displayName + " 👋";
  var customSubtitle = "You've got some overdue or unassigned tasks listed below";

  if(messageText == "today"){

    title = "Today's Tasks";
    customSubtitle = "Hi " + displayName + " 👋 here are all your tasks for today ";

  } else if (messageText == "this week") {

    title = "This Week's Tasks";
    customSubtitle = "Hi " + displayName + " 👋 here are all your tasks for the next 7 days";

  } else if (messageText == "overdue") {

    title = "Overdue Tasks";
    customSubtitle = "Hi " + displayName + " 👋 here are all your overdue tasks";
    
  } else if (messageText == "new") {

    title = "News Tasks";
    customSubtitle = "Hi " + displayName + " 👋 here are all your new tasks";
    
  }

  var cardJSON = {
    "cardsV2": [
      {
        "cardId": "unique-card-id",
        "card": {
          "header": {
            "title": title,
            "subtitle": customSubtitle,
            "imageUrl":
            "",
            "imageType": "CIRCLE",
            "imageAltText": "Avatar for Sasha",
          },
          "sections": JSON.parse(sectionJSON),
        },
      }
    ],
  }

  console.log("CardV2: \n" + JSON.stringify(cardJSON));
  return cardJSON;
}

function getCardJSONByTask(taskListID, taskID){

  var task = Tasks.Tasks.get(taskListID,taskID);
  var taskList = Tasks.Tasklists.get(taskListID);
  var taskCardJSON;
  var taskHeader = "";
  var taskTime;
  var taskListName = taskList.title;

  //console.log("task JSON started for : " + task.title);

  let taskDate = task.due;
  
  if(taskDate != undefined) {

    taskTime = getFormattedDate(task.due);

  } else {
    
      taskTime = "No due date specified";

  }

  taskCardJSON = {
            "header": taskListName,
            "collapsible": false,
            "uncollapsibleWidgetsCount": 1,
            "widgets": [
              {
                "textParagraph": {
                  "text": "<b>"+task.title+"</b>"
                }
              },
              {
                "textParagraph": {
                  "text": taskTime
                }
              },
              {
                "buttonList": {
                  "buttons": [
                    {
                      "text": "Complete",
                        "onClick": {
                          "action": {
                            "function": "onCardClick",
                            "parameters": [
                              {
                                "key": "id",
                                "value": task.id
                              },
                              {
                                "key": "listID",
                                "value": taskListID
                              },
                              {
                                "key": "taskAction",
                                "value": "complete"
                              },
                            ]
                        },
                      },
                    },
                    {
                      "text": "Tomorrow",
                      "onClick": {
                        "action": {
                            "function": "onCardClick",
                            "parameters": [
                              {
                                "key": "id",
                                "value": task.id
                              },
                              {
                                "key": "listID",
                                "value": taskListID
                              },
                              {
                                "key": "taskAction",
                                "value": "tomorrow"
                              },
                            ]
                        }
                      }
                    },
                    {
                      "text": "Next Week",
                      "onClick": {
                        "action": {
                            "function": "onCardClick",
                            "parameters": [
                              {
                                "key": "id",
                                "value": task.id
                              },
                              {
                                "key": "listID",
                                "value": taskListID
                              },
                              {
                                "key": "taskAction",
                                "value": "nextweek"
                              },
                            ]
                        }
                      }
                    },
                  ],
                }
              },
            ],
          }

  
  //console.log("task JSON completed: \n" + JSON.stringify(taskCardJSON));

  return taskCardJSON;

}


function createCardSectionJSON() {

  var overdueTasksJSON = new Array();
  var daysOfWeek = new Array("Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday");
  var hourAMPM = new Array("am","am","am","am","am","am","am","am","am","am","am","am","pm","pm","pm","pm","pm","pm","pm","pm","pm","pm","pm","pm");
  var timeHour = new Array("12","1","2","3","4","5","6","7","8","9","10","11","12","1","2","3","4","5","6","7","8","9","10","11");
  var monthNumber = new Array("1","2","3","4","5","6","7","8","9","10","11","12");
  var timeMinute = "";

  const taskLists = Tasks.Tasklists.list();
  for (let i = 0; i < taskLists.items.length; i++) {
      
      const taskList = taskLists.items[i];

      var TaskListTitle = taskLists.items[i].title;

      const tasks = Tasks.Tasks.list(taskList.id);

      
      for (let i = 0; i < tasks.items.length; i++) {
        const task = tasks.items[i];
        var taskHeader = "";
        var taskTime = "";
        
        var taskDate = new Date(tasks.items[i].due);
        var todayDate = new Date();
        var taskStatus = tasks.items[i].status;

        if(taskDate.getMinutes() < 10){
          timeMinute = "0" + taskDate.getMinutes();
        } else {
          timeMinute = taskDate.getMinutes();
        }

        if (taskStatus != "completed") {

          if (task.due == undefined) {

            taskHeader = "Unassigned";
            taskTime = "No due date set";

          } else if ( taskDate < todayDate) {

            taskHeader = "Overdue";
            taskTime = timeHour[taskDate.getHours()] + ":" + timeMinute + hourAMPM[taskDate.getHours()] + " " + daysOfWeek[taskDate.getDay()] + " " + monthNumber[taskDate.getMonth()] + "/" + taskDate.getDate() + "/" + taskDate.getFullYear();

          }
        }

        if(taskHeader == "Unassigned" || taskHeader == "Overdue") {

          console.log(taskDate);
            
          //create section JSON
          overdueTasksJSON[i] = {
              "header": taskHeader,
              "collapsible": false,
              "uncollapsibleWidgetsCount": 1,
              "widgets": [
                {
                  "textParagraph": {
                    "text": "<b>"+task.title+"</b>"
                  }
                },
                {
                  "textParagraph": {
                    "text": taskTime
                  }
                },
                {
                  "buttonList": {
                    "buttons": [
                      {
                        "text": "Complete",
                          "onClick": {
                            "action": {
                              "function": "onCardClick",
                              "parameters": [
                                {
                                  "key": "id",
                                  "value": task.id
                                },
                                {
                                  "key": "listID",
                                  "value": taskList.id
                                },
                                {
                                  "key": "taskAction",
                                  "value": "complete"
                                },
                              ]
                          },
                        },
                      },
                      {
                        "text": "Tomorrow",
                        "onClick": {
                          "action": {
                              "function": "onCardClick",
                              "parameters": [
                                {
                                  "key": "id",
                                  "value": task.id
                                },
                                {
                                  "key": "listID",
                                  "value": taskList.id
                                },
                                {
                                  "key": "taskAction",
                                  "value": "tomorrow"
                                },
                              ]
                          }
                        }
                      },
                      {
                        "text": "Next Week",
                        "onClick": {
                          "action": {
                              "function": "onCardClick",
                              "parameters": [
                                {
                                  "key": "id",
                                  "value": task.id
                                },
                                {
                                  "key": "listID",
                                  "value": taskList.id
                                },
                                {
                                  "key": "taskAction",
                                  "value": "nextweek"
                                },
                              ]
                          }
                        }
                      },
                    ],
                  }
                },
              ],
            }
        }

      }

  }

  console.log(overdueTasksJSON.length);
  console.log(JSON.stringify(overdueTasksJSON));
  return JSON.stringify(overdueTasksJSON);
}

function completeTaskFromCard(id, listID){

  //only needed if event passed to function
  //const id = event.parameters[0].value;
  //const listID = event.parameters[1].value;

  let taskToMarkCompleted = Tasks.Tasks.get(listID, id);
  var todayDate = new Date();

  taskToMarkCompleted.status = "completed";
  //taskToMarkCompleted.completed = todayDate.toDateString;

  try {

    taskToMarkCompleted = Tasks.Tasks.patch(taskToMarkCompleted, listID, id);

    console.log("Task completed: \n" + JSON.stringify(taskToMarkCompleted));

    return taskToMarkCompleted.title;

  } catch (err) {

    console.log("Task "+ id +" failed to be completed... \n" + JSON.stringify(taskToMarkCompleted));

  }

}

function tomorrowTaskFromCard(id, listID){

  let taskForTomorrow = Tasks.Tasks.get(listID, id);
  var todayDate = new Date();

  taskForTomorrow.due = getTomorrowDateTime().toISOString();

  try {

    taskForTomorrow = Tasks.Tasks.patch(taskForTomorrow, listID, id);

    console.log("Task schedule tomorrow: \n" + JSON.stringify(taskForTomorrow));

    return taskForTomorrow.title;

  } catch (err) {

    console.log("Task "+ id +" failed to be completed... \n" + JSON.stringify(taskForTomorrow));

  }

}

function nextWeekTaskFromCard(id, listID) {

  let taskForNextWeek = Tasks.Tasks.get(listID, id);
  var todayDate = new Date();

  taskForNextWeek.due = getNextWeekDateTime().toISOString();

  try {

    taskForNextWeek = Tasks.Tasks.patch(taskForNextWeek, listID, id);

    console.log("Task scheduled for next week: \n" + JSON.stringify(taskForNextWeek));

    return taskForNextWeek.title;

  } catch (err) {

    console.log("Task "+ id +" failed to be completed... \n" + JSON.stringify(taskForNextWeek));

  }

}


/**-------------------- Utility functions ----------------**/

function getAllTaskArray() {

  var allTaskCount = 0;
  var allTaskArray = new Array(); 

  const taskListArray = Tasks.Tasklists.list();

    for (let i = 0; i < taskListArray.items.length; i++) {

      var taskArray = Tasks.Tasks.list(taskListArray.items[i].id);

      for (let x = 0; x < taskArray.items.length; x++) {

        var task = taskArray.items[x];
        allTaskCount++;
        console.log(task.title + "\n" + task.status + "\n" + task.due + "\n");

        allTaskArray.push(task);
      }

    }

    console.log(allTaskCount);
    return allTaskArray;

}

function getFormattedDate(myISOdate){

  //var unformattedDate = new Date(myISOdate);
  var taskAPIDueDate = myISOdate;
  
  var taskDueYYYYMMDD = taskAPIDueDate.split("T")[0];

  var taskDueYear = taskDueYYYYMMDD.split("-")[0];
  var taskDueMonth = taskDueYYYYMMDD.split("-")[1];
  var taskDueDay = taskDueYYYYMMDD.split("-")[2];

  var unformattedDate = new Date(taskDueYear,(taskDueMonth - 1),taskDueDay);  
  
  var daysOfWeek = new Array("Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday");
  var hourAMPM = new Array("am","am","am","am","am","am","am","am","am","am","am","am","pm","pm","pm","pm","pm","pm","pm","pm","pm","pm","pm","pm");
  var timeHour = new Array("12","1","2","3","4","5","6","7","8","9","10","11","12","1","2","3","4","5","6","7","8","9","10","11");
  var monthNumber = new Array("1","2","3","4","5","6","7","8","9","10","11","12");
  var timeMinute = unformattedDate.getMinutes();

  if(timeMinute < 10){
    timeMinute = "0" + timeMinute;
  } 

  //var formattedDate = timeHour[unformattedDate.getHours()] + ":" + timeMinute + hourAMPM[unformattedDate.getHours()] + " " + daysOfWeek[unformattedDate.getDay()] + " " + monthNumber[unformattedDate.getMonth()] + "/" + unformattedDate.getDate() + "/" + unformattedDate.getFullYear();

  var formattedDate = daysOfWeek[(unformattedDate.getDay() - 1)] + " " + monthNumber[unformattedDate.getMonth()] + "/" + unformattedDate.getDate() + "/" + unformattedDate.getFullYear();

  //console.log(formattedDate);
  return formattedDate;

}

function getTomorrowDateTime(){

  var tomorrowDateTime = new Date();
  tomorrowDateTime.setDate(tomorrowDateTime.getDate() + 1);
  tomorrowDateTime.setHours(9,0,0);

  return tomorrowDateTime;

}

function getNextWeekDateTime(){

  var nextWeekDateTime = new Date();
  var daysUntilMonday = new Array(1,7,6,5,4,3,2);

  nextWeekDateTime.setDate(nextWeekDateTime.getDate() + daysUntilMonday[nextWeekDateTime.getDay()]);
  nextWeekDateTime.setHours(9,0,0);

  //console.log(nextWeekDateTime);
  return nextWeekDateTime;
}

function getNext7DaysDate() {

  var next7DaysDate = new Date();
  next7DaysDate.setDate(next7DaysDate.getDate() + 7);
  //console.log(next7DaysDate);

  return next7DaysDate;
}

/**
 * Adds a task to a tasklist.
 * @param {string} taskListId The tasklist to add to.
 * @see https://developers.google.com/tasks/reference/rest/v1/tasks/insert
 */
function addTask(taskListId) {
  // Task details with title and notes for inserting new task
  let task = {
    title: 'Pick up dry cleaning',
    notes: 'Remember to get this done!'
  };
  try {
    // Call insert method with taskDetails and taskListId to insert Task to specified tasklist.
    task = Tasks.Tasks.insert(task, taskListId);
    // Print the Task ID of created task.
    console.log('Task with ID "%s" was created.', task.id);
  } catch (err) {
    // TODO (developer) - Handle exception from Tasks.insert() of Task API
    console.log('Failed with an error %s', err.message);
  }
}

/**
 * Lists task items for a provided tasklist ID.
 * @param  {string} taskListId The tasklist ID.
 * @see https://developers.google.com/tasks/reference/rest/v1/tasks/list
 */
function listTasks(taskListId) {
  try {
    // List the task items of specified tasklist using taskList id.
    //const tasks = Tasks.Tasks.list(taskListId);

  var optionalArgs = {
      maxResults: 100,
      showHidden: true,
      showDeleted: true
  }

    const tasks = Tasks.Tasks.list(taskListId,optionalArgs);
    // If tasks are available then print all task of given tasklists.
    if (!tasks.items) {
      console.log('No tasks found.');
      return;
    }
    // Print the task title and task id of specified tasklist.
    for (let i = 0; i < tasks.items.length; i++) {
      const task = tasks.items[i];
      console.log('Task "%s" \n Notes %s \n Status %s \n Due %s \n Completed %s', task.title, task.notes, task.status, task.due, task.completed);

    }
  } catch (err) {
    // TODO (developer) - Handle exception from Task API
    console.log('Failed with an error %s', err.message);
  }
}

/**
 * Lists the titles and IDs of tasksList.
 * @see https://developers.google.com/tasks/reference/rest/v1/tasklists/list
 */
function listTaskLists() {
  try {
    // Returns all the authenticated user's task lists.
    const taskLists = Tasks.Tasklists.list();

    // If taskLists are available then print all tasklists.
    if (!taskLists.items) {
      console.log('No task lists found.');
      return;
    }
    // Print the tasklist title and tasklist id.
    for (let i = 0; i < taskLists.items.length; i++) {
      const taskList = taskLists.items[i];
      console.log('List \n %s \n ID %s', taskList.title, taskList.id);

      listTasks(taskList.id);

      //addTask(taskList.id);
    }
  } catch (err) {
    // TODO (developer) - Handle exception from Task API
    console.log('Failed with an error %s ', err.message);
  }
}

/** ---------- Example JSON for an entire card --------------- */
/**
 * 
 * 
 * return {
    "cardsV2": [
      {
        "cardId": "unique-card-id",
        "card": {
          "header": {
            "title": "Hi " + displayName + " 👋",
            "subtitle": "You've got some overdue tasks listed below",
            "imageUrl":
            "",
            "imageType": "CIRCLE",
            "imageAltText": "Avatar for Sasha",
          },
          "sections": [
            {
              "header": "Overdue",
              "collapsible": false,
              "uncollapsibleWidgetsCount": 1,
              "widgets": [
                {
                  "textParagraph": {
                    "text": "<b>Take out the trash</b>"
                  }
                },
                {
                  "textParagraph": {
                    "text": "9:00am | Mon 9/29/2023"
                  }
                },
                {
                  "buttonList": {
                    "buttons": [
                      {
                        "text": "Mark Complete",
                        "onClick": {
                          "openLink": {
                            "url": "https://example.com/share",
                          }
                        }
                      },
                      {
                        "text": "Tomorrow",
                        "onClick": {
                          "openLink": {
                            "url": "https://example.com/share",
                          }
                        }
                      },
                      {
                        "text": "Next Week",
                        "onClick": {
                          "action": {
                            "function": "goToView",
                            "parameters": [
                              {
                                "key": "viewType",
                                "value": "EDIT",
                              }
                            ],
                          }
                        }
                      },
                    ],
                  }
                },
              ],
            },
            {
              "header": "Overdue",
              "collapsible": false,
              "uncollapsibleWidgetsCount": 1,
              "widgets": [
                {
                  "textParagraph": {
                    "text": "<b>Mop the kitchen</b>"
                  }
                },
                {
                  "textParagraph": {
                    "text": "9:00am | Mon 9/29/2023"
                  }
                },
                {
                  "buttonList": {
                    "buttons": [
                      {
                        "text": "Mark Complete",
                        "onClick": {
                          "openLink": {
                            "url": "https://example.com/share",
                          }
                        }
                      },
                      {
                        "text": "Tomorrow",
                        "onClick": {
                          "openLink": {
                            "url": "https://example.com/share",
                          }
                        }
                      },
                      {
                        "text": "Next Week",
                        "onClick": {
                          "action": {
                            "function": "goToView",
                            "parameters": [
                              {
                                "key": "viewType",
                                "value": "EDIT",
                              }
                            ],
                          }
                        }
                      },
                    ],
                  }
                },
              ],
            },
          ],
        },
      }
    ],
  }
}
 */
