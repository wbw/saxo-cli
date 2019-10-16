export default function algostrategies(strategy: string, cmd: any): void {
  cmd.parent.apiUrl = "ref/v1/algostrategies";
  if (strategy) {
    cmd.parent.apiUrl = `${cmd.parent.apiUrl}/${strategy}`;
  }
}
