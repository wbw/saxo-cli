export default function instrument(uic: string, assetType: string, cmd: any): void {
  assetType = assetType || "stock";
  cmd.parent.apiUrl = `ref/v1/instruments/details/${uic}/${assetType}/?fieldgroups=OrderSetting,TradingSessions`;
}
