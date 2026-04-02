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

## Initial implementation status

- Guests can now create projects directly from `/model` with a title, room type, intent, style direction, and uploaded source photo
- Source photos are stored in MinIO-backed object storage and served back through the `/media/[...key]` route
- Project creation automatically builds a draft structured room brief and summary from the submitted form data
- Project detail pages now show the uploaded source photo, room brief summary, and the first preview state together

## Remaining follow-up

- Add image metadata extraction, validation feedback beyond file type and size, and richer room brief provenance
- Build a review and edit step for the structured brief before paid regenerations
- Support signed-in ownership and guest-to-user migration on the same project records

## Non-goals

- Multi-property portfolios in the first pass
- Measurement-accurate architectural reconstruction
