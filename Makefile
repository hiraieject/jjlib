
all clean distclean:

install:
	mkdir -p $(INSTALL_FOLDER)/jjlib/
	cp *.js *.html *.css $(INSTALL_FOLDER)/jjlib/

-include ~/.dotfiles/.makefile.gitbase.inc
