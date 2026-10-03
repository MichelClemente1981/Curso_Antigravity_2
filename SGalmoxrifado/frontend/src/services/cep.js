// Remove quaisquer caracteres não numéricos do valor do CEP
export function formatarApenasDigitos(valor) {
  return (valor || '').replace(/\D/g, '');
}

// Consulta o endereço completo a partir da API pública do ViaCEP
export async function consultarCepViaCep(cep) {
  const cepLimpo = formatarApenasDigitos(cep);
  if (cepLimpo.length !== 8) {
    throw new Error('O CEP informado deve conter 8 dígitos.');
  }

  const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  if (!resposta.ok) {
    throw new Error('Serviço de CEP temporariamente indisponível.');
  }

  const dados = await resposta.json();
  if (dados.erro) {
    throw new Error('CEP não localizado na base nacional de endereços.');
  }

  const enderecoFormatado = [dados.logradouro, dados.bairro].filter(Boolean).join(' - ');
  return {
    endereco: enderecoFormatado,
    cidade: dados.localidade || '',
    uf: dados.uf || '',
  };
}
