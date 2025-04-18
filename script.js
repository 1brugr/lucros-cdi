const graficos = {};

function calcularInvestimento() {
  const b1 = parseFloat(document.getElementById('valor_investido').value);
  const taxa_cdi = parseFloat(document.getElementById('taxa_cdi').value);
  const cdi = parseFloat(document.getElementById('valor_cdi').value);
  const anos = parseInt(document.getElementById('anos').value);

  if (isNaN(b1) || isNaN(taxa_cdi) || isNaN(cdi) || isNaN(anos)) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  const investimento_anual = b1 * 12;
  let total_acumulado = investimento_anual;
  const historico = [];

  for (let ano = 1; ano <= anos; ano++) {
    const rendimento = Math.floor(total_acumulado * (cdi / 100 * taxa_cdi / 100));
    const iof = ano === 1 ? rendimento * 0.96 : 0;
    let ir = rendimento * (ano <= 1 ? 0.20 : ano <= 2 ? 0.175 : 0.15);
    const rendimento_liquido = rendimento - ir - iof;
    total_acumulado += rendimento_liquido + investimento_anual;
    historico.push({
      Ano: ano,
      Total_Acumulado: total_acumulado,
      Lucro_Anual: rendimento,
      Lucro_Mensal: rendimento_liquido / 12
    });
  }

  document.getElementById('results').style.display = 'flex';
  const tabela = document.querySelector('#resultados-tabela tbody');
  tabela.innerHTML = '';
  historico.forEach((d) => {
    let row = tabela.insertRow();
    row.innerHTML = `
    <td>${d.Ano}</td>
    <td>${d.Total_Acumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
    <td>${d.Lucro_Anual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
    <td>${d.Lucro_Mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>`;
  });

  const anos_lista = historico.map(d => d.Ano);
  const totais = historico.map(d => d.Total_Acumulado);
  const lucros = historico.map(d => d.Lucro_Anual);
  const lucros_mensais = historico.map(d => d.Lucro_Mensal);

  gerarGrafico('graficoTotalAcumulado', 'Total Acumulado por Ano', anos_lista, totais);
  gerarGrafico('graficoLucroLiquido', 'Lucro Anual', anos_lista, lucros);
  gerarGrafico('graficoLucroMensal', 'Lucro Mensal', anos_lista, lucros_mensais);
}

function gerarGrafico(id, titulo, labels, dados) {
  const ctx = document.getElementById(id).getContext('2d');

  if (graficos[id]) {
    graficos[id].destroy();
  }

  try {
    graficos[id] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: titulo,
          data: dados,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: titulo
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 30
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return 'R$ ' + value.toLocaleString();
              }
            }
          }
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
          }
        }
      }
    });
  } catch (error) {
    console.error('Erro ao criar gráfico: ', error);
  }
}
