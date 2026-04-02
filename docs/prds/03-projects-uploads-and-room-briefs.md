# Projects, Uploads, And Room Briefs

## Goal

Turn one uploaded room image into a persistent project record with a structured remodel brief that can support high-quality generation and later iteration.

## MVP scope

- Project creation for guests and signed-in users
- Source photo upload and metadata capture
- Room photo persistence in object storage
- Structured remodel brief creation and review
- One project page or workspace entry that ties uploads, briefs, jobs, and results together

## Requirements

- The uploaded source photo must remain attached to the project for future re-use
- The remodel brief should capture room type, scope, protected elements, style direction, and realism constraints
- The brief must be editable before generation is run again
- The system should distinguish AI-inferred fields from user-confirmed fields over time
- The data model must support both guest ownership and user ownership cleanly

## Task breakdown

- Build project creation and slug generation
- Implement photo upload, image metadata capture, and object storage integration
- Define the remodel brief schema used by analysis and generation
- Add a review step that lets users confirm or refine the brief
- Persist a project summary that can be surfaced in workspace and account views

## Acceptance criteria

- A guest or user can create a project from one room photo
- The uploaded photo is still available after generation and conversion
- The remodel brief is stored as structured data, not only free-form prose
- The project shape is stable enough to support multiple generations over time

## Non-goals

- Multi-property portfolios in the first pass
- Measurement-accurate architectural reconstruction
