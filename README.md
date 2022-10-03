# `github-action` GitHub Action

## Table of Contents

* [Usage](#usage)
* [Inputs](#inputs)
* [Outputs](#outputs)

## Usage

### Get issues from pull request
```yaml 
- name: github-action
  id: cgithub-action
  uses: tangem/github-action@main
  with:
    github-token: ${{secrets.TOKEN}}
    pull-number: '1'

  - name: Get the output issues
    run: echo "Issues: ${{ steps.commit-list-action.outputs.issues }}"      
```

### Get issues from branches compare
```yaml 
- name: github-action
  id: cgithub-action
  uses: tangem/github-action@main
  with:
    github-token: ${{secrets.TOKEN}}
    base: 'main'
    head: 'test'

  - name: Get the output issues
    run: echo "Issues: ${{ steps.commit-list-action.outputs.issues }}"      
```


## Inputs
| Name           | Requirement | Default | Description                      |
|----------------|-------------|---------|----------------------------------|
| `github-token` | _required_  |         | Token for access to GitHub       |
| `pull-number`  | _optional_  |         | Number of pull request           |
| `base`         | _optional_  |         | Base branch                      |
| `head`         | _optional_  |         | Branch for compare               |


## Outputs
| Name           | Requirement                           | 
|----------------|---------------------------------------|
| `issues`       | list of issues (JSON stringify array) |  
