# NotebookLM Slide Styles — Assistant Skill

This directory contains the logic for the **NotebookLM Slide Styles** skill. This skill is designed to turn any brand guideline, image, or moodboard into a perfectly formatted YAML prompt that NotebookLM can use to generate consistent slide decks.

## What is this?
It's a structured prompt (also known as a "Skill" or "Workflow") that you can add to your AI assistant (Claude, ChatGPT, etc.) to give it the specialized ability to design for NotebookLM.

## Contents
- `SKILL.md`: The core logic and YAML schema.
- `README.md`: This file.

## How to use it as a Developer
If you are building an agent or a tool that needs to generate NotebookLM-compatible designs:
1. Load the content of `SKILL.md` into your system prompt.
2. Provide a visual input (screenshot, logo, brand book).
3. The AI will output a valid YAML that users can paste into NotebookLM's Custom Instructions.

## Integration Tip
When using this skill, ensure the AI knows to focus on **visual hierarchy** and **contrast**, as NotebookLM's engine relies on clear descriptions to map elements to slide layouts.
