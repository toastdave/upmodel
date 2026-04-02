# Generation Orchestration

## Goal

Create a reliable generation pipeline that turns a reviewed remodel brief into image outputs using local or hosted providers while preserving job state, usage costs, and replay safety.

## MVP scope

- Provider routing for local development and hosted execution
- Persisted generation jobs and status transitions
- Result storage and metadata capture
- Complimentary versus paid generation accounting
- Internal job-processing endpoint for future deferred execution

## Requirements

- Generation requests must be persisted before execution so history and retries are possible
- The same remodel brief structure should work across local Ollama and hosted Gemini paths
- Job states should clearly progress through queued, processing, succeeded, failed, and cancelled
- Usage cost and complimentary-trial handling should be captured on the job record
- The pipeline should be prepared for inline now and deferred processing later

## Task breakdown

- Add provider config and selection rules
- Define prompt compilation from room brief plus preset selection
- Implement generation job creation, state changes, and result persistence
- Add internal processing endpoint protected by a runner token
- Capture request and response metadata for debugging and tuning
- Add result cards and retry controls in the `/model` experience

## Acceptance criteria

- A project can submit a generation and show clear processing state
- Output variants are persisted and viewable after the request completes
- Complimentary and paid generations are distinguishable in the data model
- Local development works with Ollama-friendly settings even when hosted keys are absent

## Initial implementation status

- The first guest preview now creates persisted `generation_job` and `generated_variant` records instead of only rendering static placeholder UI
- Complimentary usage is tracked directly on the job and guest session records
- Generated preview assets are stored and streamed back through the same storage path that future provider outputs will use
- The current generation implementation is deterministic and local so the guest trial flow works consistently without external model dependencies

## Remaining follow-up

- Replace the deterministic preview renderer with provider-backed image generation
- Add queued and processing job states plus an internal authenticated processing endpoint
- Expand request and response metadata capture for provider debugging, retries, and refunds

## Non-goals

- Large-scale async worker infrastructure in the first pass
- Provider-specific fine-tuning workflows
