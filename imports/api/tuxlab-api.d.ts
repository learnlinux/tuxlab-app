declare module 'tuxlab-api/vm' {
	export interface VM {
	    shell: (command: string[]) => Promise<[String, String]>;
	}

}
declare module 'tuxlab-api/environment' {
	import { Profile } from '../../both/models/user.model';
	import { VM } from 'tuxlab-api/vm';
	export abstract class Environment implements VM {
	    setLabData: (data: any) => void;
	    getLabData: () => void;
	    getUserProfile: () => Profile;
	    getUserID(): string;
	    getName(): string;
	    getOrg(): string;
	    vm: VM[];
	    private getDefaultVM();
	    shell(command: string[]): Promise<[String, String]>;
	    constructor(obj: any);
	}
	export class InitObject extends Environment {
	    next: () => void;
	    error: (error?: Error) => void;
	    constructor(obj: any);
	}
	export abstract class TaskObject extends Environment {
	    setTaskData: (data: string) => void;
	    getTaskData: () => string;
	    setFeedback: (md: string) => void;
	    constructor(obj: any);
	}
	export class SetupObject extends TaskObject {
	    next: () => void;
	    error: (error?: Error) => void;
	    constructor(obj: any);
	}
	export class VerifyObject extends TaskObject {
	    next: () => void;
	    fail: () => void;
	    retry: () => void;
	    error: (error?: Error) => void;
	    setGrade: (n: number, d: number) => void;
	    constructor(obj: any);
	}

}
declare module 'tuxlab-api/vmconfig' {
	export interface VMConfigCustom {
	    name?: string;
	    image: string;
	    cmd: string[];
	    ssh_port: number;
	    username: string;
	    password_path: string;
	}
	export type VMConfig = VMConfigCustom | string;
	export function VMResolveConfig(config: VMConfig): VMConfigCustom;
	export function VMValidateConfig(config: VMConfig): boolean;

}
declare module 'tuxlab-api/lab' {
	import { VMConfig } from 'tuxlab-api/vmconfig';
	import { InitObject, SetupObject, VerifyObject } from 'tuxlab-api/environment';
	export type InitFunction = (init: InitObject) => void;
	export type SetupFunction = (setup: SetupObject) => void;
	export type VerifyFunction = (verfiy: VerifyObject) => void;
	export interface Task {
	    setup: SetupFunction;
	    verify: VerifyFunction;
	}
	export interface LabConstr {
	    name: string;
	    description?: string;
	    vm: VMConfig | VMConfig[];
	}
	export class Lab {
	    name: string;
	    description?: string;
	    _vm: VMConfig[];
	    _init: InitFunction;
	    _destroy: InitFunction;
	    _tasks: Task[];
	    constructor(opts: LabConstr);
	    init(initFn: InitFunction): void;
	    destroy(destroyFn: InitFunction): void;
	    nextTask(task: Task): void;
	}
	export function isValidLabObject(sandbox: any): sandbox is {
	    Lab: typeof Lab;
	};

}
