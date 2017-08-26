/**
  CONSOLE OUTPUT MODEL
**/

export enum ConsoleOutputType {
  info,
  log,
  warn,
  error
}

export interface ConsoleOutput {
  createdAt: Date;
  user_id : string;
  type: ConsoleOutputType;
  args: Object[];
}
