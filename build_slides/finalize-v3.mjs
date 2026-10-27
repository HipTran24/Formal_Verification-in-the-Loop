import path from 'node:path';
import { pathToFileURL } from 'node:url';
const SKILL_DIR='C:/Users/aaa/.codex/plugins/cache/openai-primary-runtime/presentations/26.1013.11914/skills/presentations';
const workspaceDir='C:/Users/aaa/Pictures/SaveCode/Formal_Verification-in-the-Loop';
const {finalizePresentation}=await import(pathToFileURL(path.join(SKILL_DIR,'container_tools/artifact_tool_utils.mjs')).href);
const result=await finalizePresentation({
  explicitTotalSlideCount:7,
  workspaceDir,
  candidatePath:path.join(workspaceDir,'build_slides/draft.pptx'),
  finalPath:path.join(workspaceDir,'output/Bao_cao_NCKH_Formal_Verification_in_the_Loop_v3.pptx'),
  pythonExecutable:'C:/Users/aaa/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',
  integrityValidatorPath:path.join(SKILL_DIR,'container_tools/inspect_presentation_package_integrity.py'),
  layoutValidatorPath:path.join(SKILL_DIR,'container_tools/inspect_presentation_layout_geometry.py'),
  layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],
  requiredNativeTableOwnerSlides:[],
  requiredNativeChartOwnerSlides:[],
  fontPolicy:{basis:'design',families:['Arial']},
  verifyArtifactToolImport:true,
  receiptPath:path.join(workspaceDir,'build_slides/final-validation-v3.json'),
});
console.log(JSON.stringify(result,null,2));
