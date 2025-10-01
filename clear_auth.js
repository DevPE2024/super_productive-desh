// Execute este código no console do navegador (F12 > Console)
// para limpar completamente os cookies do Supabase

// Limpar todos os cookies do domínio
document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});

// Limpar localStorage
localStorage.clear();

// Limpar sessionStorage  
sessionStorage.clear();

// Limpar indexedDB (usado pelo Supabase)
if ('indexedDB' in window) {
    indexedDB.databases().then(databases => {
        databases.forEach(db => {
            indexedDB.deleteDatabase(db.name);
        });
    });
}

console.log('Todos os dados de autenticação foram limpos!');
console.log('Recarregue a página agora.');
