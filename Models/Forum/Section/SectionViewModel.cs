﻿namespace ASP_111.Models.Forum.Section
{
    public class SectionViewModel
    {
        public string SectionId { get; set; } = null!;
        public Dictionary<string, string?>? ErrorMessages { get; set; }
    }
}