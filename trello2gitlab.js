import fetch from 'node-fetch'
// FIXME: Please rename your .json file here
import file from './xo8WyIM1.json' assert { type: "json" }
import dotenv from 'dotenv'
dotenv.config();
const PROJECT_ID = process.env.PROJECT_ID;
const ISSUE_API_URL = `https://gitlab.asoft-python.com/api/v4/projects/${PROJECT_ID}/issues`

function createIssueFromJSON(file) {
  file.cards.forEach(issue => {
    console.log(issue.id)
    fetch(ISSUE_API_URL, {
      method: 'post',
      body: JSON.stringify({
        id: issue.id, 
        created_at: issue.dateLastActivity, 
        description: issue.desc, 
        due_date: issue.due,  
        labels: issue.labels.map(item => item.name), 
        assignee_ids: [],
        confidential: false,
        epic_id: "",
        milestone_id: "",
        title: issue.name,
        weight: "",
        // This doesn't work yet
        // attachments: issue.attachments.map(item => item.previews.map(child => child.url).join(","))
      }),
      headers: {'Content-Type': 'application/json', 'PRIVATE-TOKEN': `${process.env.TOKEN}`}
    })
    .then(res => res.json())
    .then(json => {
      console.log("Created Root Task", json.id, json.title) 
    })
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

// createLabel(file);
createIssueFromJSON(file);