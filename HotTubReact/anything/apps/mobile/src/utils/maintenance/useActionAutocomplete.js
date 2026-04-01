export function useActionAutocomplete(pastLogs) {
  const getUniqueSuggestions = () => {
    const actions = pastLogs
      .map((log) => log.action)
      .filter((action) => action && action.trim().length > 0);
    return [...new Set(actions)];
  };

  const filterSuggestions = (text) => {
    if (text.trim().length === 0) {
      return [];
    }

    const suggestions = getUniqueSuggestions();
    return suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(text.toLowerCase()),
    );
  };

  return {
    getUniqueSuggestions,
    filterSuggestions,
  };
}
