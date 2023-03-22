require 'json'
require 'open-uri'

module Jekyll
  class HackeryTag < Liquid::Tag
    def initialize(tag_name, content_id, tokens)
      super
      @content_id = content_id.strip
    end

    def render(context)
      url = "https://hackery.byjoby.com/hacks/#{@content_id}/meta.json"
      begin
        meta = JSON.parse(URI.open(url).read)
      rescue
        meta = {};
      end

      content = meta.key?('content') ? meta['content'] : ''
      hackery_url = meta.key?('url') ? meta['url'] : ''
      js_urls = meta.key?('js') ? meta['js'] : []
      css_urls = meta.key?('css') ? meta['css'] : []

      head_content = ""

      js_urls.each do |js_url|
        head_content << "<script src=\"#{js_url}\"></script>"
      end

      css_urls.each do |css_url|
        head_content << "<link rel=\"stylesheet\" href=\"#{css_url}\">"
      end

      context.registers[:page]['hackery_head'] ||= ""
      context.registers[:page]['hackery_head'] << head_content

      "<div class=\"hackery\" data-hackery=\"#{@content_id}\" data-hackery-url=\"#{hackery_url}\">#{content}</div>"
    end
  end
end

Liquid::Template.register_tag('hack', Jekyll::HackeryTag)