// canvas-app.jsx — lays the 5 redesigned screens out as iPhone artboards.
const { DesignCanvas, DCSection, DCArtboard,
  ScreenHome, ScreenMarkets, ScreenWallet, ScreenTrade, ScreenProfile, ScreenCoin,
  ScreenBuyAmount, ScreenBuyPayment, ScreenBuyConfirm, ScreenBuySuccess,
  ScreenSendRecipient, ScreenSendAmount, ScreenSendConfirm, ScreenSendSuccess, ScreenScanQR, ScreenReceive,
  ScreenSwapConfirm, ScreenSwapSuccess, ScreenTxDetail, ScreenStakeDetail, ScreenStakeAmount,
  ScreenNotifications, ScreenPriceAlert,
  ScreenSearchInitial, ScreenSearchResults, ScreenSearchEmpty,
  ScreenKYC, ScreenLanguages, ScreenAddBank } = window;

const W = 390, H = 844;
const board = { background: '#0A0D1A', borderRadius: 46, boxShadow: '0 30px 80px rgba(8,10,22,0.55), 0 0 0 1px rgba(255,255,255,0.05)' };

function CanvasApp() {
  return (
    <DesignCanvas>
      <DCSection id="flux" title="Flux — Core screens" subtitle="Redesigned in the onboarding visual language · iPhone 390×844 · EUR">
        <DCArtboard id="home" label="Home" width={W} height={H} style={board}><ScreenHome /></DCArtboard>
        <DCArtboard id="markets" label="Markets" width={W} height={H} style={board}><ScreenMarkets /></DCArtboard>
        <DCArtboard id="wallet" label="Wallet" width={W} height={H} style={board}><ScreenWallet /></DCArtboard>
        <DCArtboard id="trade" label="Trade" width={W} height={H} style={board}><ScreenTrade /></DCArtboard>
        <DCArtboard id="coin" label="Coin detail" width={W} height={H} style={board}><ScreenCoin /></DCArtboard>
        <DCArtboard id="profile" label="Profile" width={W} height={H} style={board}><ScreenProfile /></DCArtboard>
      </DCSection>
      <DCSection id="buyflow" title="Flux — Buy crypto flow" subtitle="4 steps · Amount → Payment → Confirm → Success">
        <DCArtboard id="buy-amount" label="1 · Amount" width={W} height={H} style={board}><ScreenBuyAmount /></DCArtboard>
        <DCArtboard id="buy-payment" label="2 · Payment" width={W} height={H} style={board}><ScreenBuyPayment /></DCArtboard>
        <DCArtboard id="buy-confirm" label="3 · Confirm" width={W} height={H} style={board}><ScreenBuyConfirm /></DCArtboard>
        <DCArtboard id="buy-success" label="4 · Success" width={W} height={H} style={board}><ScreenBuySuccess /></DCArtboard>
      </DCSection>
      <DCSection id="sendflow" title="Flux — Send crypto flow" subtitle="4 steps + scanner · Recipient → Amount → Confirm → Success">
        <DCArtboard id="send-recipient" label="1 · Recipient" width={W} height={H} style={board}><ScreenSendRecipient /></DCArtboard>
        <DCArtboard id="send-amount" label="2 · Amount" width={W} height={H} style={board}><ScreenSendAmount /></DCArtboard>
        <DCArtboard id="send-confirm" label="3 · Confirm" width={W} height={H} style={board}><ScreenSendConfirm /></DCArtboard>
        <DCArtboard id="send-success" label="4 · Success" width={W} height={H} style={board}><ScreenSendSuccess /></DCArtboard>
        <DCArtboard id="send-scan" label="QR scanner" width={W} height={H} style={board}><ScreenScanQR /></DCArtboard>
        <DCArtboard id="receive" label="Receive" width={W} height={H} style={board}><ScreenReceive /></DCArtboard>
      </DCSection>
      <DCSection id="swapflow" title="Flux — Swap flow" subtitle="Converter on Trade → Confirm → Success">
        <DCArtboard id="swap-confirm" label="1 · Confirm swap" width={W} height={H} style={board}><ScreenSwapConfirm /></DCArtboard>
        <DCArtboard id="swap-success" label="2 · Success" width={W} height={H} style={board}><ScreenSwapSuccess /></DCArtboard>
      </DCSection>
      <DCSection id="txflow" title="Flux — Transaction detail" subtitle="Opens on tapping a transaction in the list">
        <DCArtboard id="tx-detail" label="Transaction detail" width={W} height={H} style={board}><ScreenTxDetail /></DCArtboard>
      </DCSection>
      <DCSection id="stakeflow" title="Flux — Earn / staking" subtitle="Opens from the Earn section · Detail → Amount">
        <DCArtboard id="stake-detail" label="1 · Asset detail" width={W} height={H} style={board}><ScreenStakeDetail /></DCArtboard>
        <DCArtboard id="stake-amount" label="2 · Amount" width={W} height={H} style={board}><ScreenStakeAmount /></DCArtboard>
      </DCSection>
      <DCSection id="notifyflow" title="Flux — Notifications & alerts" subtitle="Notification feed · Create price alert">
        <DCArtboard id="notifications" label="Notifications" width={W} height={H} style={board}><ScreenNotifications /></DCArtboard>
        <DCArtboard id="price-alert" label="Create price alert" width={W} height={H} style={board}><ScreenPriceAlert /></DCArtboard>
      </DCSection>
      <DCSection id="searchflow" title="Flux — Search" subtitle="Three states · Initial → Results → Empty">
        <DCArtboard id="search-initial" label="1 · Initial" width={W} height={H} style={board}><ScreenSearchInitial /></DCArtboard>
        <DCArtboard id="search-results" label="2 · Results" width={W} height={H} style={board}><ScreenSearchResults /></DCArtboard>
        <DCArtboard id="search-empty" label="3 · Empty" width={W} height={H} style={board}><ScreenSearchEmpty /></DCArtboard>
      </DCSection>
      <DCSection id="settingsflow" title="Flux — Settings" subtitle="Mockups · placeholder data · KYC · Languages · Add bank">
        <DCArtboard id="set-kyc" label="Personal data / KYC" width={W} height={H} style={board}><ScreenKYC /></DCArtboard>
        <DCArtboard id="set-lang" label="Languages" width={W} height={H} style={board}><ScreenLanguages /></DCArtboard>
        <DCArtboard id="set-bank" label="Add bank account" width={W} height={H} style={board}><ScreenAddBank /></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<CanvasApp />);
