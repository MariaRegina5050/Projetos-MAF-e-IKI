
import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Target, 
  ListTodo, 
  ChevronDown, 
  ChevronUp, 
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building2,
  Globe2,
  FileText,
  Printer
} from 'lucide-react';
import { ProgramType, AssessmentState, ProjectInfo, Answer } from './types';
import { MAF_CATEGORIES, IKI_CATEGORIES } from './constants';
import { calculateScores, getColorForScore, getProgressColor } from './utils/scoring';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'maf' | 'iki' | 'actionPlan'>('dashboard');
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: '',
    client: '',
    sector: '',
    country: ''
  });

  const [mafAnswers, setMafAnswers] = useState<AssessmentState>({});
  const [ikiAnswers, setIkiAnswers] = useState<AssessmentState>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const mafScores = useMemo(() => calculateScores(MAF_CATEGORIES, mafAnswers), [mafAnswers]);
  const ikiScores = useMemo(() => calculateScores(IKI_CATEGORIES, ikiAnswers), [ikiAnswers]);

  const handleScoreChange = (prog: ProgramType, qId: string, score: number) => {
    const setAnswers = prog === ProgramType.MAF ? setMafAnswers : setIkiAnswers;
    setAnswers(prev => ({
      ...prev,
      [qId]: {
        ...(prev[qId] || { canImprove: false, action: '', date: '', owner: '' }),
        score
      }
    }));
  };

  const handleImprovementChange = (prog: ProgramType, qId: string, field: keyof Answer, value: any) => {
    const setAnswers = prog === ProgramType.MAF ? setMafAnswers : setIkiAnswers;
    setAnswers(prev => ({
      ...prev,
      [qId]: {
        ...(prev[qId] || { score: 0 }),
        [field]: value
      }
    }));
  };

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const generatePDF = () => {
    window.print();
  };

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Informações do Projeto\n";
    csvContent += `Nome,${projectInfo.name}\n`;
    csvContent += `Cliente,${projectInfo.client}\n`;
    csvContent += `Setor,${projectInfo.sector}\n`;
    csvContent += `País Parceiro,${projectInfo.country}\n\n`;
    csvContent += "RESULTADOS MAF\n";
    csvContent += `Pontuação Total,${mafScores.percentage.toFixed(1)}%\n`;
    csvContent += `Classificação,${mafScores.classification}\n\n`;
    csvContent += "Avaliação MAF\nCategoria,Pergunta,Nota,Melhorar?,Providência,Data,Responsável\n";
    MAF_CATEGORIES.forEach(cat => {
      cat.questions.forEach(q => {
        const ans = mafAnswers[q.id];
        csvContent += `"${cat.name}","${q.text}",${ans?.score || 0},${ans?.canImprove ? 'Sim' : 'Não'},"${ans?.action || ''}","${ans?.date || ''}","${ans?.owner || ''}"\n`;
      });
    });
    csvContent += "\nRESULTADOS IKI\n";
    csvContent += `Pontuação Total,${ikiScores.percentage.toFixed(1)}%\n`;
    csvContent += `Classificação,${ikiScores.classification}\n\n`;
    csvContent += "Avaliação IKI\nCategoria,Pergunta,Nota,Melhorar?,Providência,Data,Responsável\n";
    IKI_CATEGORIES.forEach(cat => {
      cat.questions.forEach(q => {
        const ans = ikiAnswers[q.id];
        csvContent += `"${cat.name}","${q.text}",${ans?.score || 0},${ans?.canImprove ? 'Sim' : 'Não'},"${ans?.action || ''}","${ans?.date || ''}","${ans?.owner || ''}"\n`;
      });
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SustainAssess_${projectInfo.name || 'Projeto'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderAssessment = (prog: ProgramType) => {
    const categories = prog === ProgramType.MAF ? MAF_CATEGORIES : IKI_CATEGORIES;
    const answers = prog === ProgramType.MAF ? mafAnswers : ikiAnswers;
    const scores = prog === ProgramType.MAF ? mafScores : ikiScores;

    return (
      <div className="space-y-4 print:hidden">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Avaliação {prog}</h2>
              <p className="text-slate-500">Avalie cada critério de 1 a 5 (ou 0 para N/A)</p>
            </div>
            <div className={`px-4 py-2 rounded-lg border-2 font-bold ${getColorForScore(scores.percentage)}`}>
              {scores.percentage.toFixed(1)}% - {scores.classification}
            </div>
          </div>

          <div className="space-y-4">
            {categories.map(cat => (
              <div key={cat.id} className="border border-slate-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-700">{cat.name}</span>
                    <span className="text-xs px-2 py-1 bg-slate-200 text-slate-600 rounded-full font-medium">Peso: {cat.weight * 100}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-bold text-emerald-600">
                      Média: {scores.categoryScores[cat.id]?.toFixed(1) || 0}
                    </div>
                    {expandedCategories[cat.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>
                
                {expandedCategories[cat.id] && (
                  <div className="p-4 space-y-6 bg-white">
                    {cat.questions.map(q => {
                      const ans = answers[q.id] || { score: 0, canImprove: false, action: '', date: '', owner: '' };
                      return (
                        <div key={q.id} className="pb-4 border-b border-slate-100 last:border-0">
                          <p className="text-slate-800 mb-4 font-medium">{q.text}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {[0, 1, 2, 3, 4, 5].map(v => (
                              <button
                                key={v}
                                onClick={() => handleScoreChange(prog, q.id, v)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all ${
                                  ans.score === v 
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105' 
                                  : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
                                }`}
                              >
                                {v === 0 ? 'N/A' : v}
                              </button>
                            ))}
                          </div>
                          
                          {ans.score > 0 && ans.score < 5 && (
                            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                              <label className="flex items-center gap-2 mb-3 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                                  checked={ans.canImprove}
                                  onChange={(e) => handleImprovementChange(prog, q.id, 'canImprove', e.target.checked)}
                                />
                                <span className="text-sm text-slate-700 font-medium">É possível melhorar?</span>
                              </label>
                              
                              {ans.canImprove && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
                                  <div className="md:col-span-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">PROVIDÊNCIA</label>
                                    <textarea 
                                      className="w-full p-2 border border-slate-300 rounded-md text-sm"
                                      value={ans.action}
                                      onChange={(e) => handleImprovementChange(prog, q.id, 'action', e.target.value)}
                                      placeholder="O que será feito?"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">QUANDO?</label>
                                    <input 
                                      type="date"
                                      className="w-full p-2 border border-slate-300 rounded-md text-sm"
                                      value={ans.date}
                                      onChange={(e) => handleImprovementChange(prog, q.id, 'date', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">QUEM?</label>
                                    <input 
                                      type="text"
                                      className="w-full p-2 border border-slate-300 rounded-md text-sm"
                                      value={ans.owner}
                                      onChange={(e) => handleImprovementChange(prog, q.id, 'owner', e.target.value)}
                                      placeholder="Responsável"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    const dataMaf = MAF_CATEGORIES.map(c => ({ name: c.name, score: (mafScores.categoryScores[c.id] || 0) * 20 }));
    const dataIki = IKI_CATEGORIES.map(c => ({ name: c.name, score: (ikiScores.categoryScores[c.id] || 0) * 20 }));

    return (
      <div className="space-y-6 print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">MAF Score</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getColorForScore(mafScores.percentage)}`}>
                {mafScores.classification}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black text-slate-900">{mafScores.percentage.toFixed(1)}%</span>
              <span className="text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 mb-6">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${getProgressColor(mafScores.percentage)}`}
                style={{ width: `${mafScores.percentage}%` }}
              ></div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataMaf} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="score">
                    {dataMaf.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={mafScores.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">IKI Score</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getColorForScore(ikiScores.percentage)}`}>
                {ikiScores.classification}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black text-slate-900">{ikiScores.percentage.toFixed(1)}%</span>
              <span className="text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 mb-6">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${getProgressColor(ikiScores.percentage)}`}
                style={{ width: `${ikiScores.percentage}%` }}
              ></div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataIki} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="score">
                    {dataIki.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={ikiScores.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Detalhamento por Categoria</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
                <Target size={16} /> MAF
              </h4>
              {MAF_CATEGORIES.map(cat => {
                const scorePerc = (mafScores.categoryScores[cat.id] || 0) * 20;
                return (
                  <div key={cat.id}>
                    <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                      <span>{cat.name}</span>
                      <span>{scorePerc.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${getProgressColor(scorePerc)}`}
                        style={{ width: `${scorePerc}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
                <Target size={16} /> IKI
              </h4>
              {IKI_CATEGORIES.map(cat => {
                const scorePerc = (ikiScores.categoryScores[cat.id] || 0) * 20;
                return (
                  <div key={cat.id}>
                    <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                      <span>{cat.name}</span>
                      <span>{scorePerc.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${getProgressColor(scorePerc)}`}
                        style={{ width: `${scorePerc}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderActionPlan = () => {
    const actions: any[] = [];
    MAF_CATEGORIES.forEach(cat => {
      cat.questions.forEach(q => {
        const ans = mafAnswers[q.id];
        if (ans?.canImprove && ans.action) {
          actions.push({ ...ans, qText: q.text, catName: cat.name, prog: 'MAF' });
        }
      });
    });
    IKI_CATEGORIES.forEach(cat => {
      cat.questions.forEach(q => {
        const ans = ikiAnswers[q.id];
        if (ans?.canImprove && ans.action) {
          actions.push({ ...ans, qText: q.text, catName: cat.name, prog: 'IKI' });
        }
      });
    });

    return (
      <div className="space-y-4 print:hidden">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Plano de Ação Consolidado</h2>
          {actions.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ListTodo size={48} className="mx-auto mb-4 opacity-20" />
              <p>Nenhuma providência registrada. Identifique oportunidades de melhoria nas avaliações.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Edital</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Categoria / Pergunta</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Providência</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Prazo</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Responsável</th>
                  </tr>
                </thead>
                <tbody>
                  {actions.map((act, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                          act.prog === 'MAF' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {act.prog}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-xs font-bold text-slate-400 mb-1">{act.catName}</p>
                        <p className="text-sm text-slate-700 font-medium">{act.qText}</p>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600 italic">"{act.action}"</td>
                      <td className="py-4 px-4 text-sm text-slate-600">{act.date || '-'}</td>
                      <td className="py-4 px-4 text-sm text-slate-600">{act.owner || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const PrintReport = () => (
    <div className="hidden print:block p-8 bg-white min-h-screen text-slate-900">
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Relatório de Elegibilidade</h1>
          <p className="text-emerald-700 font-bold">SustainAssess - Consultoria de Sustentabilidade</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">Data: {new Date().toLocaleDateString('pt-BR')}</p>
          <p className="text-sm">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-8">
        <div className="bg-slate-50 p-4 rounded border border-slate-200">
          <h3 className="text-xs font-black text-slate-500 uppercase mb-3">Informações do Projeto</h3>
          <p className="mb-1"><span className="font-bold">Projeto:</span> {projectInfo.name || '---'}</p>
          <p className="mb-1"><span className="font-bold">Cliente:</span> {projectInfo.client || '---'}</p>
          <p className="mb-1"><span className="font-bold">Setor:</span> {projectInfo.sector || '---'}</p>
          <p className="mb-1"><span className="font-bold">País:</span> {projectInfo.country || '---'}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded border border-slate-200 text-center">
            <h3 className="text-[10px] font-black text-slate-500 uppercase mb-1">Status MAF</h3>
            <p className="text-2xl font-black">{mafScores.percentage.toFixed(1)}%</p>
            <p className="text-[10px] font-bold uppercase">{mafScores.classification}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded border border-slate-200 text-center">
            <h3 className="text-[10px] font-black text-slate-500 uppercase mb-1">Status IKI</h3>
            <p className="text-2xl font-black">{ikiScores.percentage.toFixed(1)}%</p>
            <p className="text-[10px] font-bold uppercase">{ikiScores.classification}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold bg-slate-900 text-white px-4 py-2 mb-4">1. Detalhamento MAF</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-left border-b border-slate-300">
                <th className="p-2 w-2/3">Critério / Pergunta</th>
                <th className="p-2 text-center">Nota</th>
                <th className="p-2">Melhoria Identificada</th>
              </tr>
            </thead>
            <tbody>
              {MAF_CATEGORIES.map(cat => (
                <React.Fragment key={cat.id}>
                  <tr className="bg-emerald-50 font-bold border-b border-slate-200">
                    <td colSpan={3} className="p-2">{cat.name} (Peso: {cat.weight*100}%)</td>
                  </tr>
                  {cat.questions.map(q => {
                    const ans = mafAnswers[q.id];
                    return (
                      <tr key={q.id} className="border-b border-slate-100">
                        <td className="p-2 pl-4 text-slate-700">{q.text}</td>
                        <td className="p-2 text-center font-bold">{ans?.score || 0}</td>
                        <td className="p-2 text-xs italic">{ans?.action || '---'}</td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </section>

        <div className="page-break" style={{ pageBreakBefore: 'always' }}></div>

        <section>
          <h2 className="text-xl font-bold bg-slate-900 text-white px-4 py-2 mb-4">2. Detalhamento IKI</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-left border-b border-slate-300">
                <th className="p-2 w-2/3">Critério / Pergunta</th>
                <th className="p-2 text-center">Nota</th>
                <th className="p-2">Melhoria Identificada</th>
              </tr>
            </thead>
            <tbody>
              {IKI_CATEGORIES.map(cat => (
                <React.Fragment key={cat.id}>
                  <tr className="bg-blue-50 font-bold border-b border-slate-200">
                    <td colSpan={3} className="p-2">{cat.name} (Peso: {cat.weight*100}%)</td>
                  </tr>
                  {cat.questions.map(q => {
                    const ans = ikiAnswers[q.id];
                    return (
                      <tr key={q.id} className="border-b border-slate-100">
                        <td className="p-2 pl-4 text-slate-700">{q.text}</td>
                        <td className="p-2 text-center font-bold">{ans?.score || 0}</td>
                        <td className="p-2 text-xs italic">{ans?.action || '---'}</td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-xl font-bold bg-emerald-700 text-white px-4 py-2 mb-4">3. Plano de Ação Consolidado</h2>
          <table className="w-full text-sm border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-200">
                <th className="p-2 border border-slate-300">Origem</th>
                <th className="p-2 border border-slate-300">Providência</th>
                <th className="p-2 border border-slate-300">Prazo</th>
                <th className="p-2 border border-slate-300">Responsável</th>
              </tr>
            </thead>
            <tbody>
              {[...MAF_CATEGORIES, ...IKI_CATEGORIES].flatMap(c => c.questions).map(q => {
                const ans = mafAnswers[q.id] || ikiAnswers[q.id];
                if (!ans?.action) return null;
                return (
                  <tr key={q.id}>
                    <td className="p-2 border border-slate-300 font-bold text-xs uppercase">{mafAnswers[q.id] ? 'MAF' : 'IKI'}</td>
                    <td className="p-2 border border-slate-300">{ans.action}</td>
                    <td className="p-2 border border-slate-300 text-center">{ans.date || '---'}</td>
                    <td className="p-2 border border-slate-300">{ans.owner || '---'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>
      
      <div className="mt-12 pt-8 border-t border-slate-300 text-center text-xs text-slate-400">
        Este documento é uma avaliação preliminar automatizada. Recomenda-se revisão técnica antes da submissão oficial aos editais.
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <PrintReport />

      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-xl text-white">
                <Globe2 size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 leading-tight tracking-tight">SustainAssess</h1>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Avaliador de Elegibilidade</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={generatePDF}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all shadow-md active:scale-95"
              >
                <Printer size={18} /> Relatório PDF
              </button>
              <button 
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
              >
                <Download size={18} /> Planilha CSV
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:hidden">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Target size={12} /> Nome do Projeto
            </label>
            <input 
              type="text" 
              className="w-full text-slate-800 font-bold focus:outline-none bg-transparent"
              placeholder="Ex: Fazenda Solar X"
              value={projectInfo.name}
              onChange={(e) => setProjectInfo({...projectInfo, name: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Building2 size={12} /> Cliente
            </label>
            <input 
              type="text" 
              className="w-full text-slate-800 font-bold focus:outline-none bg-transparent"
              placeholder="Ex: Empresa Global S.A."
              value={projectInfo.client}
              onChange={(e) => setProjectInfo({...projectInfo, client: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <LayoutDashboard size={12} /> Setor
            </label>
            <input 
              type="text" 
              className="w-full text-slate-800 font-bold focus:outline-none bg-transparent"
              placeholder="Ex: Energia Renovável"
              value={projectInfo.sector}
              onChange={(e) => setProjectInfo({...projectInfo, sector: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Globe2 size={12} /> País Parceiro
            </label>
            <input 
              type="text" 
              className="w-full text-slate-800 font-bold focus:outline-none bg-transparent"
              placeholder="Ex: Brasil"
              value={projectInfo.country}
              onChange={(e) => setProjectInfo({...projectInfo, country: e.target.value})}
            />
          </div>
        </section>

        <nav className="flex items-center gap-2 p-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('maf')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'maf' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <ClipboardCheck size={18} /> Avaliação MAF
          </button>
          <button 
            onClick={() => setActiveTab('iki')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'iki' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Target size={18} /> Avaliação IKI
          </button>
          <button 
            onClick={() => setActiveTab('actionPlan')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'actionPlan' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <ListTodo size={18} /> Plano de Ação
          </button>
        </nav>

        <div className="transition-all duration-300">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'maf' && renderAssessment(ProgramType.MAF)}
          {activeTab === 'iki' && renderAssessment(ProgramType.IKI)}
          {activeTab === 'actionPlan' && renderActionPlan()}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 z-50 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> Cálculos em Tempo Real</span>
            <span className="flex items-center gap-1"><AlertCircle size={12} className="text-amber-500" /> Sessão Ativa</span>
          </div>
          <div className="flex items-center gap-2">
            <HelpCircle size={12} /> Desenvolvido por SustainAssess
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
