import { WithdrawalForm } from "./components/WithdrawalForm/WithdrawalForm";

function App() {
  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Almoxarifado Pro</h1>
          <p className="mt-2 text-sm text-gray-600">Sistema de Controle da Metalúrgica Vale do Aço</p>
        </header>
        <WithdrawalForm />
      </div>
    </main>
  );
}

export default App;
