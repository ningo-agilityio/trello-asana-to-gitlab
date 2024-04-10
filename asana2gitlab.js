import fetch from 'node-fetch'
// FIXME: Please rename your .json file here
import file from './xo8WyIM1.json' assert { type: "json" }
import dotenv from 'dotenv'
dotenv.config();
const PROJECT_ID = process.env.PROJECT_ID;
const ISSUE_API_URL = `https://gitlab.asoft-python.com/api/v4/projects/${PROJECT_ID}/issues`

function createIssueFromJSON(file) {
  file.data.forEach(issue => {
    // Don't create DONE cards
    console.log(issue.gid)
    if (!issue.completed) {
      fetch(ISSUE_API_URL, {
        method: 'post',
        body: JSON.stringify({
          // ASANA
          id: issue.gid, 
          created_at: issue.created_at, 
          description: issue.notes, 
          due_date: issue.due_on, 
          assignee_ids: [],
          confidential: false,
          epic_id: "",
          labels: issue.tags.map(item => item.name), // Asana
          milestone_id: "",
          title: issue.name,
          weight: "",
        }),
        headers: {'Content-Type': 'application/json', 'PRIVATE-TOKEN': `${process.env.TOKEN}`}
      })
      .then(res => res.json())
      .then(json => {
        console.log("Created Root Task", json.id, json.title)
        // Create links card
        const rootIssueIid = json.iid
        issue.subtasks.forEach(subTask => {
          // Create sub task
          fetch(ISSUE_API_URL, {
            method: 'post',
            body: JSON.stringify({
              // ASANA
              id: subTask.gid, 
              created_at: subTask.created_at, 
              description: subTask.notes, 
              due_date: subTask.due_on, 
              assignee_ids: [],
              confidential: false,
              epic_id: "",
              labels: subTask.tags.map(item => item.name), // Asana
              milestone_id: "",
              title: subTask.name,
              weight: "",
            }),
            headers: {'Content-Type': 'application/json', 'PRIVATE-TOKEN': `${process.env.TOKEN}`}
          })
          .then(res => res.json())
          .then(async (subIssueJson) => {
            const subIssueIid = subIssueJson.iid
            console.log("Created Sub Task", subIssueIid)

            // Link sub task
            fetch(`${ISSUE_API_URL}/${rootIssueIid}/links`, {
              method: 'post',
              body: JSON.stringify({
                // ASANA
                target_project_id: projectId,
                target_issue_iid: subIssueIid
              }),
              headers: {'Content-Type': 'application/json', 'PRIVATE-TOKEN': `${process.env.TOKEN}`}
            })
            .then(res => res.json())
            .then((linkedIssue) => {
              console.log("DONE", linkedIssue)
            })
          })
        })
      });
    }
  })
}

function createLabel(file) {
  let count = 1;
  Object.values(file.labelNames).forEach(label => {
    fetch(`https://gitlab.asoft-python.com/api/v4/projects/${projectId}/labels`, {
      method: 'post',
      body: JSON.stringify({
        id: count,
        name: label,
        color: "#5843AD",
        text_color: "#FFFFFF",
        is_project_label: true
      }),
      headers: {'Content-Type': 'application/json', 'PRIVATE-TOKEN': `${process.env.TOKEN}`}
    })
    .then(res => res.json())
    .then(json => {
      count++;
      console.log(json.Status)
    });
    
  })
}

createIssueFromJSON(file);