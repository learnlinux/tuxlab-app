
/* TEST RUNTIME COMPONENTS */
import { runTest as ContainerRuntime } from "./imports/runtime/container.app-test";
import { runTest as LabRuntime } from "./imports/runtime/lab_runtime.app-test";
import { runTest as SessionRuntime } from "./imports/runtime/session.app-test";

LabRuntime();
ContainerRuntime();
SessionRuntime();
